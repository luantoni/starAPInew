var http="http://star-api.herokuapp.com/api/v1/";

$(document).ready(function(){
	if ($("#porNome").is(':checked')){
		iniciar();
	}
	$("#selecionar").change(function(){
		selectValue = testarSelect();
		testarCategoria(selectValue);
		limparSelect();
	});
	$("#porNome").click(function(){
		limparSelect();
		$("#selecionar").val("selecionar");
		mostra(["#pesquisa"]);
		esconde(["#selectCategorias"]);
	});
	$("#todos").click(function(){
		$("#selecionar").val("selecionar");
		limparSelect();
		esconde(["#pesquisa"]);
	});
	$("#botaoPesquisar").click(function(){
		selectValue = testarSelect();
		inputValue = testarInput();
 		(inputValue !="") ? pesquisarNome(selectValue, inputValue) : pesquisarTodos(selectValue);
	});
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
	request(http+selectValue+"/"+inputValue);
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
	if (distanciaExo != ""){
		var distanciaExo = splitValue(distanciaExo);
		data = [distanciaExo]
		testeExoUrl(data, numplanetas, selectValue);
	}
	else if (cor != "" || brilho != ""){
		var cor = splitValue(cor);
		var brilho = splitValue(brilho);
		data = [cor, brilho]
		testeEstrelaUrl(data, selectValue);
	}
	else if (distanciaOp != "" || diametroOp != ""){
		var distanciaOp = splitValue(distanciaOp);
		var diametroOp = splitValue(diametroOp);
		data = [distanciaOp, diametroOp]
		testeOpenUrl(data, selectValue);
	}
}
function splitValue(parametro){
	var letraMaiscula = parametro.indexOf("A");
	var posicaoTotal = parametro.length;
	var posicaoMinima = parametro.substring(0,letraMaiscula);
	var posicaoMaxima = parametro.substring(letraMaiscula+1,posicaoTotal);
	return {"min":posicaoMinima, "max":posicaoMaxima};
}
function testarCategoria(selectValue){
	limparInput();
	var radio = $('input[name=Opcao]:checked', '#radioForm').val();
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
	if (numplanetas != "numplanetas"){
		var numplanetas = parseInt(numplanetas);
		if (numplanetas == 1){
			var minimo = numplanetas-2;
			var maximo = numplanetas+1;
		}
		else {
			var minimo = numplanetas-1;
			var maximo = numplanetas+1;
		}
		var numUrl = "min[numplanets]="+minimo+"&max[numplanets]="+maximo;
	}
	else if (numplanetas == "numplanetas"){
		var numUrl = "undefined";
	}
	return numUrl;
}
function testeExoUrl(data, numplanetas, selectValue){
	numUrl = numeroPlanetas(numplanetas);
	if (data[0].min == ""){
		if (data[0].max == "1001")distUrl = "min[distance]="+data[0].max;
		else if (data[0].max == "distancia") distUrl = "undefined"; 
	}
	else if(data[0].min != "") distUrl = "min[distance]="+data[0].min+"&max[distance]="+data[0].max;
	request(http+selectValue+"?"+numUrl+"&"+distUrl);
}

function testeEstrelaUrl(data, selectValue){
	console.log(data);
	console.log(data[0].min);
	console.log(data[0].max);
	if (data[0].min == "" && data[0].max == "cor"){
		corUrl = "undefined";
	}
	else if (data[0].min != "" && data[0].max != "cor") {
		var corUrl = "min[colorb_v]="+data[0].min+"&max[colorb_v]="+data[0].max;
	}

	if (data[1].min == "" && data[1].max == "brilho"){
		brilhoUrl = "undefined";
	}
	else if (data[1].min != "" && data[1].max != "brilho"){
		var brilhoUrl = "min[absmag]="+data[1].min+"&max[absmag]="+data[1].max;
	}

	if (distancia == "distancia"){
		anosUrl = "undefined";
	}
	else if (distancia != "distancia"){
		var anosUrl = "max[distly]="+distancia;
	}
	request(http+selectValue+"?"+brilhoUrl+"&"+anosUrl+"&"+corUrl);
}

function testeOpenUrl(data){
}

function request(url){
	$.getJSON(url, function (myArr){
		console.log(myArr);
	});
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