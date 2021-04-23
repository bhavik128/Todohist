const box = document.querySelector('.createBox');
box.addEventListener('click', () => {
    Swal.fire({
        title: 'Enter list name',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Create',
        showLoaderOnConfirm: true,
        preConfirm: async (name) => {
            const res = await fetch('/createList',{
                method:"POST",
                headers:{
                    'content-type':'application/json'
                },
                body: JSON.stringify({listName:name,userID})
            });
            const data = await res.json();
            if(data.error) {
                Swal.showValidationMessage(data.error)
            }
            if(data.listID) {
                Swal.fire({
                    title:'List created.',
                    icon:'success',
                    allowOutsideClick: false
                }).then(() => {
                    location.assign('/dashboard');
                })
            }
        },
        allowOutsideClick: false
    })
})


