const db = new PouchDB('my_database');

const inputName = document.getElementById('nombre');
const inputFecha = document.getElementById('fecha');

const btnAdd = document.getElementById('btnAdd');
const btnList = document.getElementById('btnList');

btnAdd.addEventListener('click', async (event) => {
    event.preventDefault();

    const tarea = {
        _id: new Date().toISOString() + Math.random().toString(36).substring(7),
        nombre: inputName.value,
        fecha: inputFecha.value
    };

    db.put(tarea)
    .then((response)=> {
        console.log('Tarea agregada', response);
        inputName.value = '';
        inputFecha.value = '';
    })
    .catch((err)=> {
        console.error(err);
    });
});

btnList.addEventListener('click', async (event) => {
    event.preventDefault();

    db.allDocs({include_docs: true, descending: true})
    .then((docs)=> {
        const lista = document.getElementById('lista');
        lista.innerHTML = '';

        docs.rows.forEach((row) => {
            const li = document.createElement('li');
            li.textContent = `Nombre: ${row.doc.nombre}, Fecha: ${row.doc.fecha}`;
            lista.appendChild(li);
        });
    })
    .catch((err)=> {
        console.error(err);
    });
});


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('[SW] Registrado:', reg.scope))
      .catch(err => console.error('[SW] Error de registro:', err));
  });
}
