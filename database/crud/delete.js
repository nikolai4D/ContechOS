const { DeleteController } = require("../control/DeleteController")
const {deleteFile} = require("../FileManager");

async function deleteItem(params) {

    try {
        if (!params.hasOwnProperty("id")) throw new Error("deletion interrupted: no id was provided in the parameters.")

        const delCon = new DeleteController(params.id)
        const filesToDelete = delCon.filesToDelete

        const deletionPromises = []
        for (let file in filesToDelete) {
            deletionPromises.push(deleteFile(filesToDelete[file]))
        }

        await Promise.all(deletionPromises)

        return delCon.idsToDelete
    } catch(e){
        return {
            status: "cancelled",
            error: "Deletion cancelled due to:\n" + e.message}
    }
}

module.exports = { deleteItem }
