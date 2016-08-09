/**
 * Created by Victor on 26.6.2016 г..
 */

const kinveyAppID = 'kid_r1bH5XpS';
const kinveyAppSecret = '04dfa8a0163243b499bcbd3012531b82';
const kinveyAppServiceUrl = 'https://baas.kinvey.com/';


            username: $("#registerUser").val(),
            password: $("#registerPass").val()
        },
        success: registerSuccess,
        error: showAjaxError
    });
    function registerSuccess(data, status) {

        sessionStorage.authToken = data._kmd.authtoken;
        showHideNavigationLinks();
        showHomeView();
        showInfo("User registered successfully")

    }
}
function showListBooksView(){
    $("#books").text('');
    showView('viewListBooks');
    let authBase64 = btoa(kinveyAppID + ":" + kinveyAppSecret);

    $.ajax({

        method: "GET",
        url: kinveyAppServiceUrl + "appdata/" + kinveyAppID + "/books",
        headers : {"Authorization" : "Kinvey " + sessionStorage.authToken },

        success: booksLoaded,
        error: booksAjaxError
    });
    function booksLoaded(books, status) {


        let booksTable = $("<table>")
            .append($("<tr>")
                .append($('<th>Title</th>'))
                .append($('<th>Author</th>'))
                .append($('<th>Description</th>'))
            );
        for (let book of books) {
            booksTable.append ($("<tr>")
                    .append($('<td></td>').text(book.title))
                    .append($('<td></td>').text(book.author))
                    .append($('<td></td>').text(book.description))
                );
        }
$("#books").append(booksTable);
    }
}
function booksAjaxError(){
    alert('ne sum tuk')
}
function createBook()
{
    $("#books").text('');
    showView('viewListBooks');
    let authBase64 = btoa(kinveyAppID + ":" + kinveyAppSecret);
    let newBookData;
    newBookData = {
        title: $("#bookTitle").val(),
        author: $("#bookAuthor").val(),
        description: $("#bookDescription").val()

    };
    $.ajax({


        method: "POST",
        url: kinveyAppServiceUrl + "appdata/" + kinveyAppID + "/books",
        headers : {"Authorization" : "Kinvey " + sessionStorage.authToken },
        data: newBookData,
        success: booksCreated,
        error: booksAjaxError
    });
    function booksCreated(books, status) {

        showListBooksView();
        showInfo("Books Created");
    }
}
function showCreateBookView(){

showView("viewCreateBook")
}
function logout(){
    sessionStorage.clear();
    showHomeView();
    showHideNavigationLinks();
}


$(function() {
    $("#LinkHome").click(showHomeView);
    $("#LinkLogin").click(showLoginView);
    $("#LinkRegister").click(showRegisterView);
    $("#LinkListBooks").click(showListBooksView);
    $("#LinkCreateBook").click(showCreateBookView);
    $("#LinkLogout").click(logout);

   showHomeView();
   showHideNavigationLinks();

    $("#loginButton").click(login);
    $("#registerButton").click(register);
    $("#createBookButton").click(createBook);


});
$(document).ajaxStart(function(){
    $("#loadingBox").show();
}).ajaxStop(function(){
    $("#loadingBox").hide()
});
function gottaChangeSmth()
{
    let five =5;
};

