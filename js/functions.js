function getDemonstrators() {
		
		var query = [
			"prefix envri: <http://envri.eu/ns/>",
			"prefix dcterms: <http://purl.org/dc/terms/>",
			"prefix schema: <http://schema.org/>",
			"prefix skos: <http://www.w3.org/2004/02/skos/core#>",
			"prefix fair: <https://w3id.org/fair/principles/terms/>",
			"select distinct ?principle_label ?principle_definition ?fair_principle ?demonstrator_label ?creator ?created ?demonstrator_url where {",
			"?fair_principle a fair:FAIR-SubPrinciple .",
			"?fair_principle skos:definition ?principle_definition .",
			"?fair_principle rdfs:label ?principle_label .",
			"?fair_principle envri:hasDemonstrator ?demonstrator .",
			"?demonstrator a envri:TechnologyDemonstrator .",
			"?demonstrator rdfs:label ?demonstrator_label .",
			"?demonstrator dcterms:creator ?creator .", 
			"?demonstrator dcterms:created ?created .",
			"?demonstrator schema:url ?demonstrator_url .",
			"FILTER (lang(?principle_label) = 'en' && lang(?principle_definition) = 'en')",
			"}"
		].join(" ");
		
		data=fetchData(query);
		
		// var principleLinks=[];
		var demonstrators={};
		
			var tabledata = data["results"].bindings;
			
			for(i=0; i<tabledata.length; i++) {
				var temp = tabledata[i];				
				var demonstrator = {};

				demonstrator["fair_principle"] = temp["fair_principle"].value;
				demonstrator["principle_label"] = temp["principle_label"].value;
				demonstrator["principle_definition"] = temp["principle_definition"].value;
				demonstrator["demonstrator_label"] = temp["demonstrator_label"].value;
				demonstrator["demonstrator_url"] = temp["demonstrator_url"].value;
				demonstrator["creator"] = temp["creator"].value;

				if (demonstrators[temp["principle_label"].value]) {
				  principle_demonstrators = demonstrators[temp["principle_label"].value];
				} else {
	   			  principle_demonstrators = [];
	   			  demonstrators[temp["principle_label"].value] = principle_demonstrators;
	   			}

				principle_demonstrators.push(demonstrator);
			}

			return demonstrators;
	}
	
	function principleI2() {
	
		var query = [
			"prefix ns: <http://envri.eu/ns/>",
			"prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>",
			"prefix skos: <http://www.w3.org/2004/02/skos/core#>",
			"select ?infrastructure ?repository ?value",
			"where {",
			"[] a ns:FAIRAssessment ;",
			"ns:infrastructure [ skos:prefLabel ?infrastructure ] ;",
			"ns:hasRepository [", 
			"rdfs:label ?repository ;",
			"ns:hasMetadata [ ns:categoriesAreDefinedInRegistries ?value ]",
			"] .",
			"FILTER (?value = ns:planned || ?value = 'false'^^xsd:bool || ?value='true'^^xsd:bool) }",
		].join(" ");
		
		data=fetchData(query);
		return data;
		
	}

	function principleR12() {
	
		var query = [
			"prefix ns: <http://envri.eu/ns/>",
			"prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>",
			"prefix skos: <http://www.w3.org/2004/02/skos/core#>",
			"select ?infrastructure ?repository ?value",
			"where {",
			"[] a ns:FAIRAssessment ;",
			"ns:infrastructure [ skos:prefLabel ?infrastructure ] ;",
			"ns:hasRepository [", 
			"rdfs:label ?repository ;",
			"ns:hasMetadata [ ns:hasMachineReadableProvenance ?value ]",
			"] .",
			"FILTER (?value = 'false'^^xsd:bool || ?value='true'^^xsd:bool)",
			"}",
		].join(" ");
		
		data=fetchData(query);
		return data;	
			
	}
	
	function fetchData(query) {
		//var url = "https://envrifair1.test.fedcloud.eu/sparql";
		var url="https://envri-fair.lab.uvalight.net/sparql";
		var queryUrl = url+"?query="+ encodeURIComponent(query) +"&format=json";
		var result;
			$.ajax({
			url: queryUrl,
			type: 'GET',
			async: false,
	
		success: function(data) {
			result=data;
			},
			error: function(e)
			{
			   alert("fail"+e.message);
			}
		});
		return result;
	}
