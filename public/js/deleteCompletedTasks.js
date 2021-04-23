const button = document.querySelector('.clearCompletedTasksButton');
button.addEventListener('click', (e) => {
    e.preventDefault()
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, clear it!',
        allowOutsideClick:false,
        preConfirm: async () => {
            const res = await fetch('/clearcompletedtasks',{
                method:"POST",
                headers:{
                    'content-type':'application/json'
                },
                body: JSON.stringify({deleteTaskIDs,userID,listID})
            });

            const data = await res.json();
            if(data.message === 'success') {
                Swal.fire({
                    title:'Tasks cleared.',
                    icon:'success',
                    allowOutsideClick: false
                }).then(() => {
                    location.assign(`/list/${userID}/${listID}`);
                })
            } else {
                Swal.showValidationMessage(data.error);
            }
        }
    });
});