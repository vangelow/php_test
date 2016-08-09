/**
 * Created by Victor on 26.6.2016 г..
 */

const kinveyAppID = 'kid_r1bH5XpS';
const kinveyAppSecret = '04dfa8a0163243b499bcbd3012531b82';
const kinveyAppServiceUrl = 'https://baas.kinvey.com/';



function showView(viewId) {
    $("main>section").hide();

    $("#" + viewId).show();
}
function showHideNavigationLinks(){
    let loggedIn = sessionStorage.authToken != null;
    if (loggedIn){

        $("#LinkLogin").hide();
        $("#LinkRegister").hide();
        $("#LinkListBooks").show();
        $("#LinkCreateBook").show();
        $("#LinkLogout").show();
    }
    else{
        $("#LinkLogin").show();
        $("#LinkRegister").show();
        $("#LinkListBooks").hide();
        $("#LinkCreateBook").hide();
        $("#LinkLogout").hide();
    }
}
function showHomeView(){
showView('viewHome');
}
function showLoginView(){
showView('viewLogin');
}
function login()
{

let authBase64 = btoa(kinveyAppID + ":" + kinveyAppSecret);

    $.ajax({
        method: "POST",
        url: kinveyAppServiceUrl + "user/" +kinveyAppID + "/login",
        headers : {"Authorization" : "Basic " + authBase64},
        data:
        {
            username: $("#loginUser").val(),
            password: $("#loginPass").val()
        },
        success: loginSuccess,
        error: showAjaxError
    });
    function loginSuccess(data, status) {

        sessionStorage.authToken = data._kmd.authtoken;
        showHideNavigationLinks();
        showHomeView();
        showInfo("Login successful")

    }}
function showInfo(msgText) {
    $("#infoBox").text(msgText).show().delay(3000).fadeOut();
}
function showAjaxError(data, status) {
    let errorMsg ='';
    if(typeof(data.readyState) != 'undefined' && data.readyState ==0)
        errorMsg = "Network error.";
    else if(data.responseJSON && data.responseJSON.description)
errorMsg = data.responseJSON.description;
    else
errorMsg = "Error: " + JSON.stringify(data);
    $('#infoBox').text(errorMsg).show();
}
function showRegisterView(){
showView('viewRegister');

}

function register()
{

    let authBase64 = btoa(kinveyAppID + ":" + kinveyAppSecret);

    $.ajax({
        method: "POST",
        url: kinveyAppServiceUrl + "user/" +kinveyAppID + "/",
        headers : {"Authorization" : "Basic " + authBase64},
        data:
        {
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

