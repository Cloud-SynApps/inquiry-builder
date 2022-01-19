import { LightningElement } from "lwc";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import D3 from "@salesforce/resourceUrl/d3";
import DATA from "./data";
//import TREE from "./tree";

export default class d3Tree extends LightningElement {
  svgWidth = 400;
  svgHeight = 400;

  d3Initialized = false;
  treeInitialized = false;

  renderedCallback() {
    if (this.d3Initialized && this.treeInitialized) {
      return;
    }
    this.d3Initialized = true;
    this.treeInitialized = true;

    Promise.all([
      loadScript(this, D3 + "/d3.min.js"),
      loadStyle(this, D3 + "/style.css")
    ])
      .then(() => {
        this.initializeD3();
      })
      .then(() => {
        this.initializeTree();
      })
      .then(() => this.initializeDTree())
      .catch(error => {
        console.error(error.message);

        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error loading D3",
            message: error.message,
            variant: "error"
          })
        );
      });
  }

  initializeDTree() {
    var tData = [
      { child: "John", parent: "", link: "https://yahoo.com" },
      { child: "Aaron", parent: "Kevin", link: "https://yahoo.com" },
      { child: "Kevin", parent: "John", link: "https://yahoo.com" },
      { child: "Ben", parent: "Ann", link: "https://yahoo.com" },
      { child: "Sarah", parent: "Kevin", link: "https://yahoo.com" },
      { child: "Ann", parent: "John", link: "https://yahoo.com" },
      { child: "Mark", parent: "Ann", link: "https://yahoo.com" },
      { child: "Mike", parent: "Mark", link: "https://yahoo.com" }
    ];
    var svg = d3.select(this.template.querySelector("svg.dtree"));
    svg.append("g").attr("transform", "translate(200,200)");

    var dataStructure = d3
      .stratify()
      .id(d => d.child)
      .parentId(d => d.parent)(tData);

    var treeStructure = d3.tree().size([300, 300]);
    var information = treeStructure(dataStructure);

    const simulation = d3
      .forceSimulation(information.descendants())
      .force(
        "link",
        d3
          .forceLink(information.links())
          .id(d => d.child)
          .distance(0)
          .strength(1)
      )
      .force("charge", d3.forceManyBody().strength(-50))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(information.links())
      .join("line");

    const node = svg
      .append("g")
      .attr("fill", "#fff")
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(information.descendants())
      .join("circle")
      .attr("fill", d => (d.children ? null : "#000"))
      .attr("stroke", d => (d.children ? null : "#fff"))
      .attr("r", 3.5)
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    node.append("title").text(d => d.data.name);

    simulation.on("tick", ticked);

    function ticked() {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      node.attr("cx", d => d.x).attr("cy", d => d.y);
    }

    function dragstarted(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    }
  }

  initializeTree() {
    var tData = [
      { child: "John", parent: "", link: "https://yahoo.com" },
      { child: "Aaron", parent: "Kevin", link: "https://yahoo.com" },
      { child: "Kevin", parent: "John", link: "https://yahoo.com" },
      { child: "Ben", parent: "Ann", link: "https://yahoo.com" },
      { child: "Sarah", parent: "Kevin", link: "https://yahoo.com" },
      { child: "Ann", parent: "John", link: "https://yahoo.com" },
      { child: "Mark", parent: "Ann", link: "https://yahoo.com" },
      { child: "Mike", parent: "Mark", link: "https://yahoo.com" }
    ];

    var svg = d3.select(this.template.querySelector("svg.tree"));

    svg.append("g").attr("transform", "translate(50,50)");

    var dataStructure = d3
      .stratify()
      .id(d => d.child)
      .parentId(d => d.parent)(tData);

    var treeStructure = d3.tree().size([300, 300]);
    var information = treeStructure(dataStructure);
    console.log(information.descendants());
    console.log(information.links());

    var circles = svg
      .append("g")
      .selectAll("circle")
      .data(information.descendants());
    circles
      .enter()
      .append("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 5);

    var connections = svg
      .append("g")
      .selectAll("path")
      .data(information.links());

    connections
      .enter()
      .append("path")
      .attr(
        "d",
        d =>
          "M" +
          d.source.x +
          "," +
          d.source.y +
          " C " +
          d.source.x +
          "," +
          (d.source.y + d.target.y) / 2 +
          " " +
          d.target.x +
          "," +
          (d.source.y + d.target.y) / 2 +
          " " +
          d.target.x +
          "," +
          d.target.y
      );

    var names = svg
      .append("g")
      .selectAll("text")
      .data(information.descendants());
    names
      .enter()
      .append("text")
      .text(d => d.data.child)
      .attr("x", d => d.x + 7)
      .attr("y", d => d.y + 4)
      .on("click", d => window.open(d.data.link));
  }

  initializeD3() {
    // Example adopted from https://bl.ocks.org/mbostock/2675ff61ea5e063ede2b5d63c08020c7
    const svg = d3.select(this.template.querySelector("svg.d3"));
    const width = this.svgWidth;
    const height = this.svgHeight;
    const color = d3.scaleOrdinal(d3.schemeDark2);

    const simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3.forceLink().id(d => {
          return d.id;
        })
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(DATA.links)
      .enter()
      .append("line")
      .attr("stroke-width", d => {
        return Math.sqrt(d.value);
      });

    const node = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(DATA.nodes)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("fill", d => {
        return color(d.group);
      })
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    node.append("title").text(d => {
      return d.id;
    });

    simulation.nodes(DATA.nodes).on("tick", ticked);

    simulation.force("link").links(DATA.links);

    function ticked() {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      node.attr("cx", d => d.x).attr("cy", d => d.y);
    }

    function dragstarted(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    }
  }
}