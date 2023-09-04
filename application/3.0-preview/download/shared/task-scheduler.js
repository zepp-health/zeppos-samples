export class Task {
  constructor({ id, taskPromiseFactory, timeout }) {
    this.id = id
    this.taskPromiseFactory = taskPromiseFactory
    this.canceled = false
    this.timeout = timeout
  }

  run(taskParams) {
    return new Promise((resolve, reject) => {
      const taskPromise = this.taskPromiseFactory(taskParams)

      const cancelPromise = new Promise((resolve, reject) => {
        this.cancelPromiseReject = reject
      })

      const timeoutPromise = new Promise((resolve, reject) => {
        this.timeoutId = setTimeout(() => {
          reject(new Error('Task timed out'))
        }, this.timeout)
      })

      Promise.race([taskPromise, cancelPromise, timeoutPromise])
        .then((result) => {
          if (!this.canceled) {
            resolve(result)
          }
        })
        .catch((err) => {
          if (!this.canceled) {
            reject(err)
          }
        })
        .finally(() => {
          clearTimeout(this.timeoutId)
          this.timeoutId = 0
        })
    })
  }

  cancel() {
    this.canceled = true
    if (this.cancelPromiseReject) {
      this.cancelPromiseReject(new Error('Task canceled'))
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = 0
    }
  }
}

export class TaskScheduler {
  constructor(concurrency = 1) {
    this.concurrency = concurrency
    this.runningTasks = []
    this.waitingTasks = []
    this.onCompleteCallback = null
  }

  add(task) {
    // eslint-disable-next-line promise/param-names
    const taskPromise = new Promise((reject, resolve) => {
      this.waitingTasks.push({ task, resolve, reject })
    })

    return taskPromise
  }

  start() {
    this.runNextTask()
  }

  cancel() {
    const allTasks = [...this.runningTasks, ...this.waitingTasks]
    allTasks.forEach((task) => {
      task.task.cancel()
    })
    this.runningTasks = []
    this.waitingTasks = []
    this.onCompleteCallback?.()
  }

  runNextTask() {
    while (
      this.runningTasks.length < this.concurrency &&
      this.waitingTasks.length > 0
    ) {
      const task = this.waitingTasks.shift()

      this.runningTasks.push(task)

      if (!task.task.canceled) {
        task.task
          .run()
          .then((result) => {
            if (!task.task.canceled) {
              task.resolve(result)
            }
          }, (error) => {
            if (!task.task.canceled) {
              task.reject(error)
            }
          })
          .finally(() => {
            this.onTaskCompleted(task)
          })
      } else {
        this.onTaskCompleted(task)
      }
    }
  }

  onTaskCompleted(task) {
    const index = this.runningTasks.indexOf(task)

    if (index !== -1) {
      this.runningTasks.splice(index, 1)
    }

    if (this.runningTasks.length === 0 && this.waitingTasks.length === 0) {
      this.onCompleteCallback?.()
    } else {
      this.runNextTask()
    }
  }

  onComplete(callback) {
    this.onCompleteCallback = callback
  }
}
