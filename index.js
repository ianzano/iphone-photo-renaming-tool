const exiftool = require('exiftool-vendored').exiftool;
const fs = require("fs")

const src = "F:\\Clean\\Media\\iPhone"

fs.mkdirSync(src + "\\OUT\\Error", { recursive: true })
fs.mkdirSync(src + "\\OUT\\Screenshots", { recursive: true })
fs.mkdirSync(src + "\\OUT\\DCIM\\Camera", { recursive: true })

function prep(number) {
    return (number < 10 ? "0" : "") + number
}

const prefixes = {
    jpg: "IMG",
    mov: "VID",
    png: "Screenshot"
}

async function getNewName(path, file, extension, item) {
    const tags = await exiftool.read(src + "\\" + item)

    let builder = src + "\\OUT\\" + (extension == "png" ? "Screenshots" : "DCIM\\Camera") + "\\" + prefixes[extension] + "_"

    let date
    if (tags.ModifyDate)
        date = tags.ModifyDate
    else if (extension == "mov")
        date = tags.CreationDate
    else {
        const replacedItem = item.replace("IMG_E", "IMG_")
        if (file.startsWith("IMG_E") && fs.existsSync(src + "\\" + replacedItem))
            return await getNewName(path, file.replace("IMG_E", "IMG_"), extension, replacedItem)

        return src + "\\OUT\\Error\\" + path.replace("\\", "_") + "_" + file.replace("\\", "_") + "." + extension
    }

    if (extension != "png")
        builder += date.year + prep(date.month) + prep(date.day) + "_" + prep(date.hour) + prep(date.minute) + prep(date.second)
    else
        builder += date.year + "-" + prep(date.month) + "-" + prep(date.day) + "-" + prep(date.hour) + "-" + prep(date.minute) + "-" + prep(date.second)

    const cache = builder
    builder += "." + extension

    console.log("EXISTS", builder, fs.existsSync(builder));

    for (let tries = 1; fs.existsSync(builder); tries++) {
        builder = cache + "_" + tries + "." + extension
        console.log("EXISTS", builder, fs.existsSync(builder));
    }

    return builder
}


async function main() {
    const items = fs.readdirSync(src, { recursive: true })

    let count = 0
    for (const item of items) {
        const split = /^(.*[\\/])?(.*)\.(.*)$/gm.exec(item)
        if (split) {
            let [_, path, file, extension] = split
            extension = extension.toLowerCase()

            if (!prefixes.hasOwnProperty(extension))
                continue
            count++
            console.log("------------------------------")
            console.log("FROM", src + "\\" + item)

            const destination = await getNewName(path, file, extension, item)

            console.log("TO", destination)
            console.log("------------------------------")

            fs.copyFileSync(src + "\\" + item, destination)
        }
    }

    console.log(count)
    exiftool.end()
}

main()