const styles = {
    svg: {
        position: "absolute",
    },
    node: {
        radius: 38,
        fill: "#FFCCCC",
        strokeWidth: 0,
        borderColor: "white",
    },
    nodeLabel: {
        textAnchor: "middle",
        fill: "rgba(0,0,0,.9)",
        fontSize: "13px",
    },
    link: {
        length: 200,
        stroke: "rgba(0,0,0,.9)",
        parent: { stroke: "rgb(204, 204, 204)", strokeDash: 3 }

    },
    linkLabel: {
        textAnchor: "middle",
        parent: { fill: "rgb(204, 204, 204)" },
        fill: "black",
        fontSize: "12px",
        backgroundColor: "#fff",
        textShadow:
            "0 0 2px white, 0 0 2px white, 0 0 2px white, 0 0 2px white, 0 0 2px white, 0 0 2px white, 0 0 2px white, 0 0 2px white;",
    },
    arrows: {
        fill: "rgba(0,0,0,.9)",
        parent: { fill: "rgb(204, 204, 204)" }
    },
};

export default styles;
