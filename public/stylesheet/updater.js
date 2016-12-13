/**
 * Created by sareenzhang on 12/12/16.
 */



/**
 * Created by sareenzhang on 12/2/16.
 */

document.addEventListener("DOMContentLoaded", main);

//like function not working yet

function main(e) {
    var likes = document.getElementById('likes');

    likes.addEventListener('click', function (evt) {
        //evt.preventDefault();
        var num = document.getElementById('numLikes');
        var newNum = Number(num.firstChild.nodeValue) + 1;

        num.removeChild(document.getElementById('numLikes').firstChild)
        document.getElementById('numLikes').appendChild(document.createTextNode(newNum) )

    });


    /*
    var likes = document.getElementsByName("likes"); //an array
    likes.forEach(update); //add ids


function update(like) {
    like.addEventListener('click', function (evt) {

        var url = "http://localhost:3000/api/movies/create";

        //new http request
        var req = new XMLHttpRequest();

        var title, director, year;

        title = document.getElementById('movieTitle').value;

        req.open('POST', url, true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send("id=" + title + "&director=" + director + "&year=" + year);

        req.addEventListener('load', function () {
            if (req.status >= 200 && req.status < 400) {

                var data = JSON.parse(req.responseText);

                var movieList = document.getElementById('movie-list');

                //document.body.appendChild(document.createTextNode(data[0].title));

                while (movieList.firstChild) {
                    movieList.removeChild(movieList.firstChild);
                }


                for (var i = 0; i < data.length; i++) {
                    var tr = movieList.appendChild(document.createElement('tr'));
                    var td1 = tr.appendChild(document.createElement('td'));
                    td1.appendChild(document.createTextNode(data[i].title));
                    var td2 = tr.appendChild(document.createElement('td'));
                    td2.appendChild(document.createTextNode(data[i].director));
                }

            }

        });

        req.addEventListener('error', function () {
            res.send('error');
        });


    });

}
*/

}





