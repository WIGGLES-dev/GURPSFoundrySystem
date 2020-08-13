import * as fs from "fs";
import * as path from "path";
import { Template } from "webpack";



const paths = {
    actors: {
        templates: "src/data-types/actors/templates/",
        objects: "src/data-types/actors/"
    },
    items: {
        templates: "src/data-types/items/templates/",
        objects: "src/data-types/items/"
    }
}

function readFile(path: string) {
    return fs.readFileSync(path, "utf8");
}

const getData = (paths: any) => {
    try {
        var templateTypes: any[] = [];
        var dataTypes: any[] = [];

        const templateTypePaths = fs.readdirSync(path.resolve(__dirname, paths.templates));
        const dataTypePaths = fs.readdirSync(path.resolve(__dirname, paths.objects));

        dataTypePaths.forEach(file => {
            if (file.endsWith(".json")) {
                const data = JSON.parse(readFile(path.resolve(__dirname, paths.objects + file)));
                dataTypes.push({
                    type: file.split(".json")[0],
                    data
                })
            }
        });
        templateTypePaths.forEach(file => {
            if (file.endsWith(".json")) {
                const data = JSON.parse(readFile(path.resolve(__dirname, paths.templates + file)));
                templateTypes.push({
                    type: file.split(".json")[0],
                    data
                })
            }
        });
        return {
            templateTypes,
            dataTypes
        }
    } catch (e) {
        console.log(e);
    }
};

function assignItemTemplateTypes(object: any) {
    getData(paths.items).templateTypes.forEach(template => {
        object.Item.templates[template.type] = template.data;
    });
    return object
}

function assignItemDataTypes(object: any) {
    getData(paths.items).dataTypes.forEach((item, i) => {
        object.Item.types.push(item.type);
        object.Item[item.type] = item.data[item.type];
    });
    return object
}

function assignActorTemplateTypes(object: any) {
    getData(paths.actors).templateTypes.forEach(template => {
        object.Actor.templates[template.type] = template.data
    });
    return object
}

function assignActorDataTypes(object: any) {
    getData(paths.actors).dataTypes.forEach(actor => {
        object.Actor.types.push(actor.type);
        object.Actor[actor.type] = actor.data[actor.type]
    })
    return object
}

export function buildTemplate(content: Buffer, absoluteFrom: string) {
    content = JSON.parse(content.toString());
    content = assignItemTemplateTypes(content);
    content = assignItemDataTypes(content);
    content = assignActorTemplateTypes(content);
    content = assignActorDataTypes(content);
    return JSON.stringify(content);
}

export function buildSystem(content: Buffer, absoluteFrom: string) {
    return content
}