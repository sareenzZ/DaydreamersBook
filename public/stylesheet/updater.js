/**
 * Created by sareenzhang on 12/12/16.
 */



/**
 * Created by sareenzhang on 12/2/16.
 */

document.addEventListener("DOMContentLoaded", main);

function main(e) {
    var likes = document.getElementById('likes');

    likes.addEventListener('click', function (evt) {
        //evt.preventDefault();
        var num = document.getElementById('numLikes');
        var newNum = Number(num.firstChild.nodeValue) + 1;

        num.removeChild(document.getElementById('numLikes').firstChild)
        document.getElementById('numLikes').appendChild(document.createTextNode(newNum) )

    })


}





