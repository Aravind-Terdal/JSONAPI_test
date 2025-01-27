const cl = console.log;

// get all the objects by ID
const postForm = document.getElementById('postForm');
const contentControls = document.getElementById('content');
const titleControls = document.getElementById('title');
const userIdControls = document.getElementById('userId');
const PostSubmitBtn = document.getElementById('PostSubmitBtn');
const PostUpdateBtn = document.getElementById('PostUpdateBtn');
const postContainer = document.getElementById('postContainer');

// now get the Data base by url 
const BASE_URL = `https://jsonplaceholder.typicode.com`;
const POST_URL = `${BASE_URL}/posts`;

// new add the snakBar for confirmation

const snakBar = (msg, icon) => {
    swal.fire({
        title : msg,
        icon : icon,
        timer : 2500
    })
};

// now templeate the data from dataBase 

const templating = (arr) => {
    let result = '';
    arr.forEach(card => {
        result += `
                    <div class="card mb-4 " id="${card.id}">
                        <div class="card-header">
                            <h3 class="m-0">${card.title}</h3>
                        </div>
                        <div class="card-body">
                            <p class="m-0">
                            ${card.body}
                            </p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-sm btn-outline-info" onClick="onEdit(this)">Edit</button>
                            <button class="btn btn-sm btn-outline-danger" onClick="onRemove(this)">Remove</button>
                        </div>
                    </div>
                    `
    });
    postContainer.innerHTML = result;
};

// config the data from database


const fetchAllPosts = () => {
    
    let xhr = new XMLHttpRequest();

    xhr.open("GET", POST_URL);
    xhr.send(null);
    xhr.onload = function() {
        if(xhr.status >= 200 && xhr.status <= 299) {
            let data = JSON.parse(xhr.response);
            templating(data);
        }else{
            alert(`Somthing Went Wrong !!!`)
        }
    }

}
fetchAllPosts();

// now add the add post feature 

const onPostAdd = (eve) => {
    eve.preventDefault();
// add the object 
    let newPost = {
        title : titleControls.value,
        body : contentControls.value,
        userId : userIdControls.value
    }
    postForm.reset();
// now make API Config 
    let xhr = new XMLHttpRequest();

    xhr.open("POST", POST_URL);
    xhr.send(JSON.stringify(newPost));
    xhr.onload = function() {
        if(xhr.status >= 200 && xhr.status <= 299){
            let data = JSON.parse(xhr.response);
            cl(data);
            let card = document.createElement('div');
            card.className = `card mb-4`;
            card.id = data.id
            card.innerHTML = `
                                <div class="card-header">
                                    <h3 class="m-0">${newPost.title}</h3>
                                </div>
                                <div class="card-body">
                                    <p class="m-0">
                                    ${newPost.body}
                                    </p>
                                </div>
                                <div class="card-footer d-flex justify-content-between">
                                     <button class="btn btn-sm btn-outline-info" onClick="onEdit(this)">Edit</button>
                                     <button class="btn btn-sm btn-outline-danger" onClick="onRemove(this)">Remove</button>
                                </div>
                            `
            postContainer.append(card);
            snakBar(`New Post Add Successfully !!!`, `success`)

            // cl(card);
        }else{
            alert(`Somthing Went Wrong !!!`);
        }
    }
}


// now add the edit feature and by making the edit by selecting the and adding the attribute in js and select the child alement


const onEdit = (ele) => {
    cl(ele)
    let EDIT_ID = ele.closest('.card').id;
    cl(EDIT_ID)
    localStorage.setItem('editid', EDIT_ID);

    let EDIT_URL =`${BASE_URL}/posts/${EDIT_ID}`
    cl(EDIT_URL);
    let xhr = new XMLHttpRequest();

    xhr.open("GET", EDIT_URL);

    xhr.send(null);

    xhr.onload = function () {
        if(xhr.status >= 200 && xhr.status <= 299) {
            let data = JSON.parse(xhr.response);
            cl(data);
            titleControls.value = data.title;
            contentControls.value = data.body;
            userIdControls.value = data.userId;

            PostSubmitBtn.classList.add('d-none');
            PostUpdateBtn.classList.remove('d-none');
        }
    }

}

// now show the object on UI / get the object from selecting by id 


const onPostUpdate = () => {
    let upDatedObject = {
        title : titleControls.value,
        body : contentControls.value,
        userId : userIdControls.value,
    }
    cl(upDatedObject);
    let UPDATED_ID = localStorage.getItem('editid');
    let UPDATED_URL = `${BASE_URL}/posts/${UPDATED_ID}`;
    cl(UPDATED_URL);
    let xhr = new XMLHttpRequest();
    xhr.open("PATCH", UPDATED_URL);
    xhr.send(JSON.stringify(upDatedObject));
    xhr.onload = function() {
        if(xhr.status >= 200 && xhr.status <= 299){
            let cardChild = document.getElementById(UPDATED_ID).children;
            cardChild[0].innerHTML = `<h3 class="m-0">${upDatedObject.title}</h3>`
            cardChild[1].innerHTML = `<p class="m-0">${upDatedObject.title}</p>`
            postForm.reset();
            PostSubmitBtn.classList.remove('d-none');
            PostUpdateBtn.classList.add('d-none')
            snakBar(`Post Updated Successfully !!!`, `success`)

        }
    }
}


// remove an object from UI

const onRemove = (ele) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          let REMOVE_ID = ele.closest('.card').id;
          cl(REMOVE_ID);
          let REMOVE_URL = `${BASE_URL}/posts/${REMOVE_ID}`;
          let xhr = new XMLHttpRequest();
          xhr.open('DELETE', REMOVE_URL);
          xhr.send(null);
          xhr.onload = function() {
            if(xhr.status >= 200 && xhr.status <= 299){
                cl(xhr.response);
                ele.closest('.card').remove();

                snakBar(`Post Removed Successfully !!!`, `success`)
            }
          }
        }
      });
}









postForm.addEventListener('submit', onPostAdd);
PostUpdateBtn.addEventListener('click', onPostUpdate);





