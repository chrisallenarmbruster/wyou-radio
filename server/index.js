require("dotenv").config()
const httpServer = require("./app")
const { syncAndSeed } = require("./db")

const init = async () => {
  try {
    await syncAndSeed()
    const port = process.env.PORT || 3000
    try {
      httpServer.listen(port, () => console.log(`listening on port ${port}`))
    } catch (ex) {
      console.log("listen error")
    }
  } catch (ex) {
    console.log(ex)
  }
}

init()
