import { FileDoc } from "./FileDoc.js";
import { UserInterface } from "./UserInterface.js";
/*importa le due classi definite negli altri files*/
export class App {
  ui = new UserInterface(); /* nuova istanza della classe UserInterface */
  files = []; /* dichiara l'array files */
  openFile = null; /* dichiara openFile e sotto idFile */
  idFile = -1;
  /* costruttore: i dati sono presi dal file editor.js che contengono gli id dell'html, che istanzia una nuova app e tramite il costruttore assegna i valori all'istanza di UserInterface  */
  constructor(_ui) {
    this.ui = _ui;

    /*inizializza tinymce, passando il riferimento all html tramite la proprietà dell'oggetto*/
    tinymce.init({
      selector: `#${this.ui.editor}`,
    });

    /*assegna le proprietà dell'oggetto riferendosi al DOM e passando la proprietà dell'oggetto UserInterface come sopra*/
    this.save = document.querySelector(`#${this.ui.save}`);
    this.title = document.querySelector(`#${this.ui.title}`);
    this.editor = document.querySelector(`#${this.ui.editor}`);
    this.file_list = document.querySelector(`#${this.ui.file}`);
    this.new = document.querySelector(`#${this.ui.new}`);
    /* chiama il metodo definito sotto che fa il bind dell'evento click */
    this.eventHandlers();
    /* chiama il metodo loadDocs che recupera i dati dal localStorage*/
    this.loadDocs();
  }
  eventHandlers() {
    /*attenzione al bind this: è necessario passare il this con bind altrimenti risulterebbe undefined all'interno della funzione: cioè tu non "vedi" this all'interno della funzione e quindi lo devi ri-passare tramite bind */
    this.save.addEventListener("click", this.saveDoc.bind(this));
    this.new.addEventListener("click", this.newDoc.bind(this));
  }
  loadDocs() {
    if (localStorage.getItem("files")) {
      this.files = JSON.parse(localStorage.getItem("files"));
      /*legge il localStorage e poi chiama il metodo build*/
      this.build();
    }
  }
  loadFile(el) {
    /*metodo che carica l'oggetto file */
    this.idFile = el.target.dataset.id;
    this.openFile = new FileDoc(
      this.files[this.idFile].title,
      this.files[this.idFile].text
    );
    this.title.value = this.openFile.title;
    tinymce.get(this.ui.editor).setContent(this.openFile.text);
  }
  newDoc() {
    /*chiamata al metodo per ripulire */
    this.clean();
  }
  saveDoc() {
    /*se openFile è vuoto crea un nuovo oggetto file e fa il push nell'array files*/
    if (this.openFile == null) {
      let file = new FileDoc();
      file.title = this.title.value;
      file.text = tinymce.get(this.ui.editor).getContent();
      this.files.push(file);
    } else {
      /*altrimenti modifica il file terza riga assegnando i valori letti dal form*/
      this.openFile.title = this.title.value;
      this.openFile.text = tinymce.get(this.ui.editor).getContent();
      this.files[this.idFile] = this.openFile;
    }
    // salva l'array files nel localstorage
    localStorage.setItem("files", JSON.stringify(this.files));
    // chiama la funzione che stampa a video
    this.build();
  }
  build() {
    /*pulisce il form*/
    this.clean();
    /*pulisce il contenitore dei risultati*/
    this.file_list.innerHTML = "";
    /*con il ciclo foreach appende la stringa html nel contenitore in pagina*/
    this.files.forEach((el, index) => {
      this.file_list.innerHTML += `<li data-id="${index}" class="list-group-item list-group-item-action docs">${el.title}</li>`;
    });
    $(".docs").click(this.loadFile.bind(this));
  }

  clean() {
    /* svuota il form e annulla openFile*/
    this.title.value = "";
    tinymce.get(this.ui.editor).setContent("");
    this.openFile = null;
  }
}
