var gLoading = new KTDialog({
    'type': 'loader',
    'placement': 'top center',
    'message': '<div class="spinner px-5"></div><span>Loading...</span>'
});
$.ajaxSetup({
    beforeSend: function () {
        gLoading.show();
    },
    complete: function () {
        gLoading.hide();
    }
});