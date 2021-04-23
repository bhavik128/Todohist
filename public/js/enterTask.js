const form = document.querySelector('form');
const taskError = document.querySelector('.enterTaskError');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    taskError.textContent = "";
    const task = form.task.value;
    const res = await fetch('/entertask',{
        method:'POST',
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify({task,userID,listID})
    });
    const data = await res.json();
    if(data.error) {
        taskError.textContent = data.error;
    } else if(data.taskID) {
        location.assign(`/list/${userID}/${listID}`);
    }
})