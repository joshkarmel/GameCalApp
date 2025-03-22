import Card from "react-bootstrap/Card";


function EmptyCalendarCard(props: any) {
    const date = props.date;
    const grey = props.grey;
    return (
        <Card style={{
            height: "150px",
            minWidth: "125px",
            backgroundColor: grey ? "rgb(20,20,20)" : "#222",
            borderRadius: "inherit",
            border: "2px solid black",
        }}>
            <Card.Body>
                {date &&
                    (<Card.Title
                        style={{
                            position: "absolute",
                            textAlign: "right",
                            color: "white",
                            fontWeight: 650,
                            backgroundColor: "#222",
                            borderRadius: "0 0 0 60%",
                            boxShadow: "-2px 2px 10px black",
                            textWrap: "nowrap",
                            top: 0,
                            right: 0,
                            minWidth: "20px",
                            height: "28px",
                            padding: "0 10px"
                        }}>
                        {date}
                    </Card.Title>)}
            </Card.Body>
        </Card>);
}

export default EmptyCalendarCard;