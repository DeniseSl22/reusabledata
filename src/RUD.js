////
////
////

// Let jshint pass over over our external globals (browserify takes
// care of it all).
/* global jQuery */

var us = require('underscore');
var cytoscape = require('cytoscape');
var regCose = require('cytoscape-cose-bilkent');
regCose( cytoscape ); // register extension

// Aliases
var each = us.each;

// Code here will be ignored by JSHint, as we are technically
// "redefining" jQuery (although we are not).
/* jshint ignore:start */
// var jQuery = require('jquery');
/* jshint ignore:end */

///
/// ...
///

///
var InteractionViewer = function(global_data, graph_id){

    var graph_layout = 'cose-bilkent'; // default

    var DEBUG = true;
    function ll(str){
	if(DEBUG){
            console.log(str);
	}
    }

    // Translate into something cytoscape can understand.
    // Nodes first, capture/cache license infor along the way
    var elements = [];
    var license2idlist = {};
    each(global_data, function(n){

	var nid = n['id'];
	var nlbl = n['source'];
	var lic = n['license'];

	// Trim and special labels for overly long/weird ones.
	if( nlbl.indexOf('(') !== -1 ){
	    nlbl = nlbl.slice(0, nlbl.indexOf('(') -1);
	}
	if( nid === 'panther' ){
	    nlbl = 'PANTHER';
	// }else if( nid === 'clinvar' ){
	//     nlbl = '';
	}

	// Save who is in what group for licensing interactions.
	if( ! license2idlist[lic] ){
	    license2idlist[lic] = [];
	}
	license2idlist[lic].push(nid);

	// Push into cytoscape struct.
	elements.push({
	    group: 'nodes',
	    data: {
		id: nid,
		label: nlbl,
		//parent: parent,
		//'text-valign': text_v_align,
		//'text-halign': text_h_align,
		'background-color': '#666666',
		//degree: (g.get_child_nodes(n.id()).length * 10) +
		//  g.get_parent_nodes(n.id()).length
	    }
	});
    });

    // Okay, one more time around, this time looking at licensing
    // info for interactions.
    each(global_data, function(n){

	var nid = n['id'];
	var nlbl = n['source'];
	var lic = n['license'];

	if( lic === 'CC0-1.0' ){ // pd-ish /can/ go into everything
	    each( us.keys(license2idlist), function(okay_lic){
		each( license2idlist[okay_lic], function(cohort_id){
		    if( nid !== cohort_id ){
			// Push edge data.
			elements.push({
			    group: 'edges',
			    data: {
				//id: ,
				source: nid,
				target: cohort_id,
				predicate: 'remixes_with',
				label: 'can remix into',
				color: '#009999',
				glyph: 'triangle'
			    }
			});
		    }
		});
	    });
	}
	if( lic === 'CC-BY-4.0' || lic === 'CC-BY-3.0' || lic === 'CC-BY' || lic === 'MIT'){
	    each( ['CC-BY-4.0',
		   'CC-BY',
		   'MIT',
		   'CC-BY-SA-4.0',
		   'CC-BY-SA-3.0',
		   'GPL-3.0',
		   'ODbL-1.0'], function(okay_lic){
		each( license2idlist[okay_lic], function(cohort_id){
		    if( nid !== cohort_id ){
			// Push edge data.
			elements.push({
			    group: 'edges',
			    data: {
				//id: ,
				source: nid,
				target: cohort_id,
				predicate: 'remixes_with',
				label: 'can remix into',
				color: '#009999',
				glyph: 'triangle'
			    }
			});
		    }
		});
	    });
	}
	if( lic === 'CC-BY-SA-4.0' || lic === 'CC-BY-SA-3.0' || lic === 'GPL-3.0' || lic ===  'ODbL-1.0'){
	    each( ['CC-BY-SA-4.0',
		   'CC-BY-SA-3.0',
		   'GPL-3.0',
		   'ODbL-1.0'], function(okay_lic){
		each( license2idlist[okay_lic], function(cohort_id){
		    if( nid !== cohort_id ){
			// Push edge data.
			elements.push({
			    group: 'edges',
			    data: {
				//id: ,
				source: nid,
				target: cohort_id,
				predicate: 'remixes_with',
				label: 'can remix into',
				color: '#009999',
				glyph: 'triangle'
			    }
			});
		    }
		});
	    });
	}

    });

    // Setup possible layouts.
    var layout_opts = {
	'cose': {
	    name: 'cose',
	    padding: 10,
	    //animate: false,
	    animate: true,
	    'directed': true,
	    'fit': true
	    // //'maximalAdjustments': 0,
	    // 'circle': false,
	    //'roots': cyroots
	},
	'cose-bilkent': {
	    name: 'cose-bilkent',
	    // // Called on `layoutready`
	    // ready: function () {
	    // },
	    // // Called on `layoutstop`
	    // stop: function () {
	    // },
	    // // Whether to include labels in node dimensions. Useful for avoiding label overlap
	    // nodeDimensionsIncludeLabels: false,
	    // // number of ticks per frame; higher is faster but more jerky
	    // refresh: 30,
	    // // Whether to fit the network view after when done
	    // fit: true,
	    // // Padding on fit
	    // padding: 10,
	    // // Whether to enable incremental mode
	    randomize: true//,
	    // // Node repulsion (non overlapping) multiplier
	    // nodeRepulsion: 4500,
	    // // Ideal (intra-graph) edge length
	    //		idealEdgeLength: 150,
	    // // Divisor to compute edge forces
	    // edgeElasticity: 0.45,
	    // // Nesting factor (multiplier) to compute ideal edge length for inter-graph edges
	    // nestingFactor: 0.1,
	    // // Gravity force (constant)
	    // gravity: 0.25,
	    // // Maximum number of iterations to perform
	    // numIter: 2500,
	    // // Whether to tile disconnected nodes
	    // tile: true,
	    // // Type of layout animation. The option set is {'during', 'end', false}
	    // animate: 'end',
	    // // Amount of vertical space to put between degree zero nodes during tiling (can also be a function)
	    // tilingPaddingVertical: 10,
	    // // Amount of horizontal space to put between degree zero nodes during tiling (can also be a function)
	    // tilingPaddingHorizontal: 10,
	    // // Gravity range (constant) for compounds
	    // gravityRangeCompound: 1.5,
	    // // Gravity force (constant) for compounds
	    // gravityCompound: 1.0,
	    // // Gravity range (constant)
	    // gravityRange: 3.8,
	    // // Initial cooling factor for incremental layout
	    // initialEnergyOnIncremental:0.8
	},
	'random': {
	    name: 'random',
	    fit: true
	},
	'grid': {
	    name: 'grid',
	    fit: true,
	    padding: 30,
	    rows: undefined,
	    columns: undefined
	},
	'circle': {
	    name: 'circle',
	    fit: true,
	    sort: function(a, b){
		return a.data('degree') - b.data('degree');
	    }
	},
	'breadthfirst': {
	    name: 'breadthfirst',
	    directed: true,
	    fit: true,
	    //nodeDimensionsIncludeLabels: true,
	    spacingFactor: 1.0,// 1.75,
	    padding: 30,// 30,
	    //maximalAdjustments: 0,
	    circle: false//,
	    //roots: root_ids
	}
	// 'arbor': {
	// 	name: 'arbor',
	// 	fit: true, // whether to fit to viewport
	// 	padding: 10 // fit padding
	// },
    };

    // Ramp up view.
    var cy = cytoscape({
	// UI loc
	container: document.getElementById(graph_id),
	// actual renderables
	elements: elements,
	layout: layout_opts[graph_layout],
	style: [
	    {
		selector: 'node',
		style: {
		    'content': 'data(label)',
		    //			'width': 150,
		    //			'height': 100,
		    'width': 50,
		    'height': 35,
		    'background-color': 'white',
		    //			'background-color': 'black',
		    'border-width': 1,
		    'border-color': 'black',
		    //			'font-size': 14,
		    'font-size': 8,
		    'min-zoomed-font-size': 3, //10,
                    'text-valign': 'center',
                    'color': 'black',
		    //                      'color': 'black',
		    'shape': 'roundrectangle',
		    //'shape': show_shape,
		    //                        'text-outline-width': 1,
		    //                        'text-outline-color': '#222222',
		    'text-wrap': 'wrap',
		    'text-max-width': '48px'
		}
	    },
	    {
		selector: 'edge',
		style: {
		    // NOTE/WARNING: From
		    // http://js.cytoscape.org/#style/edge-line
		    // and other places, we need to use 'bezier'
		    // here, rather than the default 'haystack'
		    // because the latter does not support glyphs
		    // on the endpoints. However, this apparently
		    // incurs a non-trivial performance hit.
		    'curve-style': 'bezier',
		    'text-rotation': 'autorotate',
		    'text-margin-y': '-6px',
		    'target-arrow-color': 'data(color)',
		    'target-arrow-shape': 'data(glyph)',
		    'target-arrow-fill': 'filled',
		    'line-color': 'data(color)',
		    'content': 'data(label)',
		    'font-size': 6,
		    'min-zoomed-font-size': 3, //10,
                    'text-valign': 'center',
                    'color': 'white',
		    //			'width': 6,
                    'text-outline-width': 1,
		    'text-outline-color': '#222222'
		}
	    }
	],
	// initial viewport state:
	//zoom: 1,
	//pan: { x: 0, y: 0 },
	// interaction options:
	minZoom: 0.1,
	maxZoom: 3.0,
	zoomingEnabled: true,
	userZoomingEnabled: true,
	wheelSensitivity: 0.25,
	panningEnabled: true,
	userPanningEnabled: true,
	boxSelectionEnabled: true,
	selectionType: 'single',
	touchTapThreshold: 8,
	desktopTapThreshold: 4,
	autolock: false,
	autoungrabify: false,
	autounselectify: false,
	ready: function(){
	    ll('interaction graph ready for: ' + graph_id);
	}
    });

    //
    cy.viewport({
	//zoom: 2//,
	//pan: { x: 100, y: 100 }
    });

    // Make sure that there is a notice of highlight when we are
    // working.
    // cy.on('select', function(evt){
    //     console.log( 'selected: ' + evt.target.id() );
    //     evt.target.style('background-color', 'gray');
    // });
    // cy.on('unselect', function(evt){
    //     console.log( 'unselected: ' + evt.target.id() );
    //     evt.target.style('background-color', 'white');
    // });

    // // TODO: notice on hover.
    // //
    // // Hacky, but I think should work in practice.
    // var color_holder = 'red';
    // var offset = 25;
    // cy.on('mouseover', function(evt){
    // 	if( evt && evt.target && evt.target.id ){
    // 	    // Detect if node or not.
    // 	    var entity_id = evt.target.id();
    // 	    if( entity_id.substr(0, 8) === 'gomodel:' ){
    // 		color_holder = evt.target.style('background-color');
    // 		console.log( 'mouseovered: (' +
    // 			     color_holder + ') ' +
    // 			     entity_id );
    // 		evt.target.style('background-color', 'red');

    // 		// jQuery("#hoverbox").append('info about: ' + entity_id);
    // 		var gotten_node = g.get_node(entity_id);
    // 		var nso = new node_stack_object(gotten_node, aid);
    // 		jQuery("#hoverbox").append(nso.to_string());

    // 		var scroll_left = jQuery(document).scrollLeft();
    // 		var scroll_top = jQuery(document).scrollTop();
    // 		var x = (evt.originalEvent.pageX + offset - scroll_left) +
    // 			'px';
    // 		var y = (evt.originalEvent.pageY + offset - scroll_top) +
    // 			'px';
    // 		jQuery('#hoverbox').css('border-width', '1px');
    // 		jQuery('#hoverbox').css('border-style', 'solid');
    // 		jQuery('#hoverbox').css('border-color', 'black');
    // 		jQuery('#hoverbox').css('border-radius', '3px');
    // 		jQuery('#hoverbox').css('background-color', 'white');
    // 		jQuery('#hoverbox').css('padding', '1em');
    // 		jQuery('#hoverbox').css('position', 'fixed');
    // 		jQuery('#hoverbox').css('top', y);
    // 		jQuery('#hoverbox').css('left', x);
    // 		jQuery("#hoverbox").removeClass('hidden');
    // 	    }
    // 	}
    // });
    // cy.on('mouseout', function(evt){
    // 	if( evt && evt.target && evt.target.id ){
    // 	    // Detect if node or not.
    // 	    var entity_id = evt.target.id();
    // 	    //console.log(evt);
    // 	    if( entity_id.substr(0, 8) === 'gomodel:' ){
    // 		console.log( 'mouseouted: (' +
    // 			     color_holder + ') ' +
    // 			     entity_id );
    // 		evt.target.style('background-color', color_holder);
    // 		jQuery("#hoverbox").addClass('hidden');
    // 		jQuery("#hoverbox").empty();
    // 	    }
    // 	}
    // });
};

module.exports = {
    'InteractionViewer': InteractionViewer
};
