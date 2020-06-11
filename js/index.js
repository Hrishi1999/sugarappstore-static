var miniSearch

function clearActivityCards() {
    $('#activity-card-column').empty();
}

function getActivityIndex () {
  
}

function addActivityCard(item) {
    var name = item['name'];
    var bundle_id = item['bundle_id']
    var icon_path = item['icon_name'];
    var summary = item['summary'] != null ? item['summary'] : 'No info provided';
    var url_container
    if ($.trim( item['url']) != ""){
        url_container = `<a href="${item['url']}" class="btn btn-primary"><i class="fa fa-info-circle"></i></a>`
    } else {
        url_container = ""
    }
    var bundle_path = `../bundles/${item['bundle_name']}`
    if (item['exec_type'] == 'web'){
        var exec_type = `<img src="../img/activity-browse.png" alt="Works with Webkit" height=38px>`
    } else if (item['exec_type'] == 'python2') {
        var exec_type = `<img src="../img/python2.png" alt="Powered by Python2.x" height=38px>`
    } else if (item['exec_type'] == 'python3') {
        var exec_type = `<img src="../img/python3.png" alt="Powered by Python3.x" height=38px>`
    } else {
        var exec_type = ""
    }
    if (item['v']) {
        var version = `<div class="card-version">\
                    <p class="card-version-text">v<span style="font-weight:700">${item['v']}</span></p>\
                </div>`
    } else {
        var version = ''
    }
    
    
    $('#activity-card-column').append(
        `<div class="card saas-card">\
            <img class="card-img-top" style="padding:12%" src="../icons/${icon_path}.svg" alt="${name} Icon">\
            <div class="card-body">\
                <div class="saas-heading">\
                    <a href="../app/${bundle_id}.html" style="color:#000"><h5 class="card-title saas-h1">${name}</h5></a>
                </div>\
                ${version}
                <p class="card-text">${summary}</p>\
                <a href="${bundle_path}" class="btn btn-primary"><i class="fa fa-download"></i></a>\
                ${url_container}
                ${exec_type}
            </div>\
        </div>`
    )
}


function loadAllActivities () {
    // get the json file
    if ($.trim( $('#saas-search-box').val() ) != ''){
        // the user has entered something, filter the list accordingly
        $.getJSON("../index.json", function(data) {
            console.log("Searching using miniSearch");
            if (miniSearch == null){
                // index minisearch once and only once
                // reduces CPU usage

                console.log("minisearch indexed.")
                miniSearch = new MiniSearch({
                    fields: ['name', 'summary'], // fields to index for full-text search
                    storeFields: ['name', 'summary', 'url', 'icon_name', 'bundle_name', 'v', 'bundle_id'], // fields to return with search results
                    searchOptions: {
                        boost: { title: 2 },
                        fuzzy: 0.5
                    }
                });
                // Index all documents
                miniSearch.addAll(data);
            }
            let results = miniSearch.search($('#saas-search-box').val())
            $.each(results, function(i, item){
                addActivityCard(item)
            })
        });
    } else {
        $.getJSON("../index.json", function(data) {
        console.log(data)
        // update the UI with each card
        $.each(data, function(i, item){
            addActivityCard(item)
        })
        }); 
    }
    

};