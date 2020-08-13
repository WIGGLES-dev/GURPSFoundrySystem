import * as fs from "fs";
import * as path from "path";

enum Extensions {
    advantages = "adq",
    advantageModifier = "adm",
    equipment = "eqp",
    equipmentModifier = "eqm",
    skill = "skl",
    notes = "not",
    templates = "gct"
}

export class CompendiumBuilder {
    static library = dataExtractor()
    static pathToLibrary = ""

    constructor() {

    }

    private static typeFromPath(path: string[]): Extensions {
        return path.pop().split(".")[1] as Extensions
    }

    private static getPath(path: string[]): string {
        const rootIndex = path.findIndex(value => value === "Master Library");
        return path.slice(rootIndex).join("/");
    }

    private static fetchData(path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch(path).then(response => response.json().then(data => resolve(data)));
        })
    }

    private static findPack(moduleName: string, packName: string) {
        return game.packs.find((p: Compendium) => p.collection === `${moduleName}.${packName}`) as Compendium
    }

    private static dataToEnity(data: any[]): Promise<Entity[]> {
        return new Promise((resolve, reject) => {
            Entity.createMany(data, { temporary: true }).then(entity => resolve(entity))
        })
    }

    private static importEntity(pack: Compendium, entity: Entity[]) {
        entity.forEach(entity => pack.importEntity(entity));
    }

    private static containerRecursor(data: any): any[] {
        const children = data.children.map((child: any) => {
            if (child.type.includes("container")) {
                CompendiumBuilder.containerRecursor(child)
            } else {
                return child
            }
        });
        return Array.prototype.concat(...children)
    }

    static build() {
        CompendiumBuilder.library.forEach(path => {
            CompendiumBuilder.fetchData(CompendiumBuilder.getPath(path)).then(data => {
                data.rows.forEach((row: any) => {
                    CompendiumBuilder.dataToEnity(row).then(entity => CompendiumBuilder.importEntity(
                        CompendiumBuilder.findPack(
                            "world",
                            CompendiumBuilder.typeFromPath(path)
                        ),
                        entity
                    ));
                    CompendiumBuilder.containerRecursor(row).forEach(child => {

                    })
                })
            })
        })
    }
}

function getFiles(dir: string, hook: (dir: string) => void) {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });
    const files: (string | string[])[] = dirents.map(dirent => {
        const res = path.resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            return getFiles(res, hook);
        } else {
            hook(res);
            return res
        }
    });
    return Array.prototype.concat(...files)
}

function dataExtractor() {
    const data: string[][] = [];

    function handleFile(file: string) {
        data.push(file.split("\\"));
    }

    const list = getFiles("./Master Library", handleFile);
    console.log(data);

    return data
}

dataExtractor();