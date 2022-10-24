//Record is a cool name indeed, but already taken.
const fs = require("fs")

function doesFileExist(id, defType) {
    try {
        return fs.existsSync(`../db/${defType}/${id}.json`)
    } catch (e) {
        throw (e)
    }
}

function getItemById(id, defType) {
    let json
    try {
        json = fs.readFileSync(`../db/${defType}/${id}.json`, "utf8")
    } catch (e) {
        throw (e)
    }

    const item = JSON.parse(json);
    return { id, defType, ...item };
}

/**
 *
 * @param defTypes
 * @param limit
 * @param from
 * @param filterFunction must return a boolean indicating if the item should be added to the request or not.
 * @param filterParams
 * @returns {*[]}
 */
function getBulk(defTypes, limit = 50, from = 0, filterFunction = null, filterParams) {
    const items = []
    for (let defType of defTypes) {
        const dir = `../db/${defType}/`
        let files = fs.readdirSync(dir)

        if (files.length <= from) {
            from -= files.length
            files = []
        }
        else if (files.length > from) {
            files = files.slice(from, files.length)
            from = 0
        }

        for (let file of files) {
            const item = JSON.parse(fs.readFileSync(dir + file, "utf8"));
            if (filterFunction !== null && !filterFunction(item, filterParams)) continue
            let id = file.slice(0, -5);
            items.push({ id, defType, ...item })

            if (limit > 0 && items.length >= limit) return items
        }
    }
    return items
}

function createFile(defType, id, item){
    fs.writeFileSync(
        `../db/${defType}/${id}.json`,
        JSON.stringify(item, null, 2)
    );
    console.log("created: " + JSON.stringify({ id, defType, ...item }, null,2))
    return { id, defType, ...item }
}

async function deleteFile(path){
    return fs.promises.unlink(path)
}

module.exports = { getItemById, getBulk, doesFileExist, createFile, deleteFile }