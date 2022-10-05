$(document).ready(function () {
  $("#product-price-in-dollars").keyup(updatePaidValue);
  $("#bank-spread").keyup(updatePaidValue);

  function updatePaidValue() {
    verifyMin(this);
    let oneDayToMilliseconds = 8.64e7;
    let today = new Date();
    let twoWeeksAgo = new Date(today.getTime() - 14 * oneDayToMilliseconds);
    let priceInUSS = $("#product-price-in-dollars").val();
    let urlSource = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial=%27${formatDate(twoWeeksAgo)}%27&@dataFinalCotacao=%27${formatDate(today)}%27&$top=100&$format=json&$select=cotacaoCompra`;
    $.getJSON(urlSource, function (data) {
      let PTAXDollar = data.value.slice(-1)[0].cotacaoCompra;
      let IOF = 1.0638;
      let bankSpread = 0.01 * $("#bank-spread").val() + 1;
      let finalPrice =
        Math.round(PTAXDollar * IOF * bankSpread * priceInUSS * 100) / 100;
      $("#paid-value-in-brazilian-reais").val(finalPrice);
    }).fail(() => {
      alert(
        "A conexão com a API do Bacen falhou! Verifique o estado da sua conexão com a Internet."
      );
    });
  }

  function formatDate(date) {
    let day = date.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let year = date.getYear() + 1900;
    let dayArr = [month, day, year];
    return dayArr.join("-");
  }

  function verifyMin(arg) {
    let v = Number($(arg).val());
    let min = Number($(arg).attr("min"));

    if (v < min) {
        $(arg).val(min);
    }}
});
