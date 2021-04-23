const bins = document.querySelectorAll('#bin');
bins.forEach(bin => {
    bin.addEventListener('click',() => {
        const listID = bin.parentNode.parentNode.children[0].children.namedItem('listID').value;
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            allowOutsideClick:false,
            preConfirm: async () => {
                const res = await fetch('/deleteList',{
                    method:"POST",
                    headers:{
                        'content-type':'application/json'
                    },
                    body:JSON.stringify({listID,userID})
                });

                const data = await res.json();
                if(data.message === 'Success') {
                    Swal.fire({
                        title:'List deleted.',
                        icon:'success',
                        allowOutsideClick: false
                    }).then(() => {
                        location.assign('/dashboard');
                    })
                } else {
                    Swal.showValidationMessage(data.error);
                }
            }
        });
    });
});