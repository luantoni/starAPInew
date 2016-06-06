var http="http://star-api.herokuapp.com/api/v1/";
var cabecalho={
 listaestrelas:'<table id="oi" class="table table-bordered table-responsive " border="1"><tr><th>Id</th><th>Nome</th><th>Luminosidade</th><th>Cor</th><th>Distância</th><th>Plx</th><th>Velocidade</th></tr>',
 listaexo: '<table class="table table-bordered table-responsive " border="1"><tr><th>Id</th><th>Nome</th><th>Número Planetas</th><th>Distância</th></tr>',
 listaopen: '<table class="table table-bordered table-responsive " border="1"><tr><th>Id</th><th>Nome</th><th>Diâmetro</th><th>Metal</th><th>Distância</th></tr>',
 listatodos: '<table class="table table-bordered table-responsive " border="1"><tr><th>Id</th><th>Nome</th></tr>'
}

$(document).ready(function(){

	if ($("#porNome").is(':checked')){
		iniciar();
	}
	$("#selecionar").change(function(){
		selectValue = testarSelect();
		testarCategoria(selectValue);
		esconde(["#conteudo"]);
		limparSelect();
	});
	$("#porNome").click(function(){
		limparSelect();
		$("#selecionar").val("selecionar");
		mostra(["#pesquisa"]);
		esconde(["#selectCategorias", "#conteudo"]);
	});
	$("#todos").click(function(){
		$("#selecionar").val("selecionar");
		limparSelect();
		esconde(["#pesquisa","#selectCategorias","#conteudo"]);
	});
	$("#botaoPesquisar").click(function(){
		selectValue = testarSelect();
		inputValue = testarInput();
 		(inputValue !="") ? pesquisarNome(selectValue, inputValue) : pesquisarTodos(selectValue);
	});
});

$(document).keypress(function(e) {
	if (e.which == 13) {
		e.preventDefault();
		inputValue = testarInput();
		selectValue = testarSelect();
		(inputValue !="") ? pesquisarNome(selectValue, inputValue) : pesquisarTodos(selectValue);
	}
});

function iniciar(){
	mostra(["#pesquisa","#botaoPesquisa","#selecionar"]);
	esconde(["#selectCategorias"]);
	selectValue = testarSelect();
}
function testarSelect(){
	var selectValue = $("#selecionar").val();
	return selectValue;
}
function testarInput(){
	var inputValue = $("#pesquisa").val();
	return inputValue;
}
function pesquisarNome(selectValue, inputValue){
	var nbsp = inputValue.replace('%20',' ');
	requestIndividual(http+selectValue+"/"+inputValue);
}
function pesquisarTodos(selectValue){
	var radio = $('input[name=Opcao]:checked', '#radioForm').val();
	if (radio == "todos")categoriasValue(selectValue);
}
function categoriasValue(selectValue){
	var cor = $("#cor").val();
	var distancia = $("#distancia").val();
	var brilho = $("#brilho").val();
	var numplanetas = $("#numplanetas").val();
	var distanciaExo = $("#distanciaExo").val();
	var diametroOp = $("#diametroOp").val();
	var distanciaOp = $("#distanciaOp").val();
	testeValor(cor, distancia, brilho, numplanetas, distanciaExo, diametroOp, distanciaOp);
}
function testeValor(cor, distancia, brilho, numplanetas, distanciaExo, diametroOp, distanciaOp){
	var data;
	selectValue = testarSelect();
	switch(selectValue){
		case "exo_planets":
			var distanciaExo = splitValue(distanciaExo);
			data = [distanciaExo,0,0]
			data = testeUndefined(data);
			testeExoUrl(data, numplanetas, selectValue);
		break;
		case "stars":
			var cor = splitValue(cor);
			var brilho = splitValue(brilho);
			data = [cor, brilho, distancia]
			data = testeUndefined(data);
			testeEstrelaUrl(data, selectValue);
		break;
		case "open_cluster":
			var distanciaOp = splitValue(distanciaOp);
			var diametroOp = splitValue(diametroOp);
			data = [distanciaOp, diametroOp, 0]
			data = testeUndefined(data);
			testeOpenUrl(data, selectValue);
		break;
	}
}
function splitValue(parametro){
	var letraMaiscula = parametro.indexOf("A");
	var posicaoTotal = parametro.length;
	var posicaoMinima = parametro.substring(0,letraMaiscula);
	var posicaoMaxima = parametro.substring(letraMaiscula+1,posicaoTotal);
	return {"min":posicaoMinima, "max":posicaoMaxima};
}

function testeUndefined(data){
	var testeFirstData = isNaN(data[0].max);
	var testeSecondData = isNaN(data[1].max);
	var testeThirdData = isNaN(data[2]);
	if (testeFirstData == true) data[0].max="undefined";
	if (testeSecondData == true) data[1].max="undefined";
	if (testeThirdData == true) data[2]="undefined";
	return data;
}
function testarCategoria(selectValue){
	limparInput();
	var radio = $('input[name=Opcao]:checked', '#radioForm').val();
	var result="";
	switch (selectValue){
		case "selecionar":
			esconde(["#selectCategorias"]);
			$('.jumbotron').css('backgroundImage','url(constelacao.jpg)');
		break;

		case "stars":
			if(radio == "todos") mostrarEstrela(); 
			$('.jumbotron').css('backgroundImage','url(estrelas.jpg)');
		break;

		case "exo_planets":
			if(radio == "todos") mostrarExoplaneta();
			$('.jumbotron').css('backgroundImage','url(exoplanet.jpg)');
		break;

		case "open_cluster":
			if(radio == "todos") mostrarOpen();
			$('.jumbotron').css('backgroundImage','url(openstar.jpg)');
		break;
	}
}
function numeroPlanetas(numplanetas){
	var numplanetas = parseInt(numplanetas);
	if (numplanetas == 1) {var minimo = numplanetas-2; var maximo = numplanetas+1;}
	else var minimo = numplanetas-1; var maximo = numplanetas+1;
	var numUrl = "min[numplanets]="+minimo+"&max[numplanets]="+maximo;
	return numUrl;
}
function testeExoUrl(data, numplanetas, selectValue){
	var distUrl;
	var numUrl;
	(numplanetas !="numplanetas") ? numUrl = numeroPlanetas(numplanetas) : numUrl = "undefined";
	if (data[0].max == "undefined") distUrl = "undefined"; 
	else if (data[0].max == "1001") distUrl = "min[distance]="+data[0].max;
	else distUrl = "min[colorb_v]="+data[0].min+"&max[colorb_v]="+data[0].max;
	request(http+selectValue+"?"+numUrl+"&"+distUrl);
}

function testeEstrelaUrl(data, selectValue){
	var corUrl;
	var brilhoUrl;
	var anosUrl;
	if (data[0].max == "undefined")	corUrl = "undefined";
	else corUrl = "min[colorb_v]="+data[0].min+"&max[colorb_v]="+data[0].max;

	if (data[1].max == "undefined") brilhoUrl = "undefined";
	else brilhoUrl = "min[absmag]="+data[1].min+"&max[absmag]="+data[1].max;

	if (data[2] == "undefined")	anosUrl = "undefined";
	else anosUrl = "max[distly]="+data[2];
	request(http+selectValue+"?"+brilhoUrl+"&"+anosUrl+"&"+corUrl);
}

function testeOpenUrl(data, selectValue){
	var distUrl;
	var diamUrl;

	if (data[0].max == "undefined") distUrl = "undefined"; 
	else if (data[0].max == "6001") distUrl = "min[distly]="+data[0].max;
	else distUrl = "min[distly]="+data[0].min+"&max[distly]="+data[0].max;

	if (data[1].max == "undefined") diamUrl = "undefined";
	else if (data[1].max == "100") diamUrl = "min[diam]="+data[1].max;
	else diamUrl = "min[diam]="+data[1].min+"&max[diam]="+data[1].max;
	request(http+selectValue+"?"+diamUrl+"&"+distUrl);
}

function request(url){
	$.getJSON(url, function (myArr){
		selectValue = testarSelect();
		var result = "";
		if (selectValue == "stars") result += cabecalho.listaestrelas;
		else if (selectValue == "exo_planets") result += cabecalho.listaexo;
		else if (selectValue == "open_cluster") result+= cabecalho.listaopen;
		montarTabela(myArr, result);
	});
}
function requestIndividual(url){
	$.getJSON(url, function (myArr){
		selectValue = testarSelect();
		var result = "";
		result+= cabecalho.listatodos;
		montarTabelaIndividual(myArr, result);
	});
}
function montarTabelaIndividual(myArr, result){
	result+='<tr><td>'+ myArr.id + '</td>';
	result += '<td>'+ myArr.label + '</td>';
	'</tr>';
	'</table>';
	$("#conteudo").show();
	$('#conteudo').html(result);
}
function montarTabela(myArr, result){
		for (i=0; i < 10; i++){
			result+='<tr><td>'+ myArr[i].id + '</td>';
			result += '<td>'+ myArr[i].label + '</td>';
			if ($(myArr[i].lum).length !=0){
				result += '<td>'+myArr[i].lum+'</td>';
				result += (($(myArr[i].colorb_v).length !=0) ? '<td>'+myArr[i].colorb_v+'</td>' : "");
				result += (($(myArr[i].distly).length !=0) ? '<td>'+myArr[i].distly+'</td>' : "");
				result += (($(myArr[i].plx).length !=0) ? '<td>'+myArr[i].plx+'</td>' : "<td></td>");
				result += (($(myArr[i].speed).length !=0) ? '<td>'+myArr[i].speed+'</td>' : "<td></td>");
			}
			if ($(myArr[i].numplanets).length !=0){
				result +=  '<td>'+myArr[i].numplanets+'</td>';
				result += (($(myArr[i].distance).length !=0) ? '<td>'+myArr[i].distance+'</td>' : "");
			}
			if ($(myArr[i].diam).length !=0){
				result += '<td>'+ myArr[i].diam+'</td>';
				result += (($(myArr[i].metal).length !=0) ? '<td>'+myArr[i].metal+'</td>' : "<td></td>");
				result += (($(myArr[i].distly).length !=0) ? '<td>'+myArr[i].distly+'</td>' : "");
			}
		'</tr>';
	}
		'</table>';
		$("#conteudo").show();
		$('#conteudo').html(result);
}

function limparInput(){
	$("#pesquisa").val('');
}

function limparSelect(){
	$("#cor").val("cor");
	$("#brilho").val("brilho");
	$("#distancia").val("distancia");
	$("#numplanetas").val("numplanetas");
	$("#distanciaExo").val("distancia");
	$("#diametroOp").val("diametroOp");
	$("#distanciaOp").val("distanciaOp");
	$("#pesquisa").val('');
	$("#conteudo").val('');
}
function mostrarEstrela(){
	mostra(["#selectCategorias", ".estrelasSelect"]);
	esconde([".exoplanetasSelect",".openSelect"]); //".openSelect"
}
function mostrarExoplaneta(){
	mostra(["#selectCategorias", ".exoplanetasSelect"]);
	esconde([".estrelasSelect",".openSelect"]); 
}
function mostrarOpen(){
	mostra(["#selectCategorias", ".openSelect"]);
	esconde([".estrelasSelect",".exoplanetasSelect"]); 
}
function esconde (array){
	for (var x=0; x<array.length; x++){
		$(array[x]).hide();
	}
}
function mostra (array){
	for (var x=0; x<array.length; x++){
		$(array[x]).show();
	}
}