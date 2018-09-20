Stripe.setPublishableKey('pk_test_bCkIuYRjQ8OczMaLjZAcbI7V');

var $form = $('#checkout-form');

$form.submit(function(event){
    $('#charge-error').addClass('d-none');
    $form.find('button').prop('disabled', true);
    Stripe.card.createToken({
        number: $('#credit').val(),
        cvc: $('#cvc').val(),
        exp_month: $('#exmonth').val(),
        exp_year: $('#exyear').val(),
        name: $('#name').val()
    }, stripeResponseHandler);
    return false;
});

function stripeResponseHandler(status, response){
    if(response.error){
        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('d-none');
        $form.find('button').prop('disabled', false);
    } else {
        var token = response.id;
        $form.append($('<input type="hidden" name="stripeToken"/>').val(token));

        $form.get(0).submit();
    }
}