import { App } from "./scripts/App.js";

export let app = new App(
    {
        save: "save",
        new: "new",
        editor: "editor_txt",
        file: "file_list",
        title: "title_txt",
    }
);
console.log(app)
