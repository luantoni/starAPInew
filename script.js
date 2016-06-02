var http="http://star-api.herokuapp.com/api/v1/";

$(document).ready(function(){
	if ($("#porNome").is(':checked')){
		iniciar();
	}

	$("#selecionar").change(function(){
		selectValue = testarSelect();
		testarCategoria(selectValue);
	});

	$("#porNome").click(function(){
		limparSelect();
		mostra(["#pesquisa"]);
		esconde(["#selectCategorias"]);
	});
	
	$("#todos").click(function(){
		limparSelect();
		esconde(["#pesquisa"]);
	});

	$("#botaoPesquisar").click(function(){
		selectValue = testarSelect();
		inputValue = testarInput();
 		(inputValue !="") ? pesquisarNome(selectValue, inputValue) : pesquisarTodos(selectValue);
	});
});

function pesquisarNome(selectValue, inputValue){
	var nbsp = inputValue.replace('%20',' ');
	request(http+selectValue+"/"+inputValue);
}

function pesquisarTodos(selectValue){
	var radio = $('input[name=Opcao]:checked', '#radioForm').val();
	if (radio == "todos"){
		categoriasValue(selectValue);
	}
}

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

function categoriasValue(selectValue){
	var cor = $("#cor").val();
	var distancia = $("#distancia").val();
	var brilho = $("#brilho").val();
	var numplanets = $("#numplanetas").val();
	var distanciaExo = $("#distanciaExo").val();
	var diametroOp = $("#diametroOp").val();
	var distanciaOp = $("#distanciaOp").val();
	console.log(cor);
	console.log(distancia);
	console.log(brilho);
	console.log(numplanets);
	console.log(distanciaExo);
	console.log(diametroOp);
	console.log(distanciaOp);
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
	$("#selecionar").val("selecionar");
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