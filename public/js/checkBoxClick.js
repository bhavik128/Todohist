const checkBoxes = document.querySelectorAll('.checkBox');
const error = document.querySelector('.enterTaskError');
checkBoxes.forEach( checkBox => {
    checkBox.addEventListener('change', async(e) => {
        e.preventDefault();
        error.textContent = "";
        const res = await fetch('/checkbox',{
            method:"POST",
            headers: {
                'content-type':'application/json'
            },
            body: JSON.stringify({userID,listID,taskID:checkBox.value,checked:checkBox.checked})
        });
        const data = await res.json();
        if(data.message === 'ok') {
            location.assign(`/list/${userID}/${listID}`);
        } else if(data.error) {
            error.textContent = data.error;
        }
    })
})