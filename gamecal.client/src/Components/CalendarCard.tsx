import Card from "react-bootstrap/Card";
import {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

interface CardState {
    name: string;
}

function CalendarCard(props: any) {
    const [cardState, setCardState] = useState<CardState>();
    const game = props.game;
    const date = props.date;
    const coverImage = props.coverImage;
    const key = props.id + game.id + "bkgd";

    useEffect(() => {
        setCardState({
            name: ""
        })
    }, []);

    const blurBackground = () => {
        let background = document.getElementById(key);
        if (background) {
            background.style.filter = "blur(1.5px)";
        }
        setCardState({...cardState, name: game.name});
    }
    const unblurBackground = () => {
        let background = document.getElementById(key);
        if (background) {
            background.style.filter = "none";
        }
        setCardState({...cardState, name: ""});
    }

    return cardState && (
        <Card style={{
            borderRadius: "3%",
            border: 'solid 4px black',
            height: "150px",
            width: props.style.width,
            maxWidth: "100%",
        }}>
            <Card.Body
                onMouseOver={() => blurBackground()}
                onMouseLeave={() => unblurBackground()}
                style={{
                    ...props.style,
                    fontWeight: 750,
                    color: "white",
                    textShadow: "2px 2px 2px black",
                    textOverflow: "clip",
                    border: "2px black",
                    borderRadius: "inherit",
                    height: "100%",
                    width: props.width,
                    textDecoration: "none",
                    padding: 3
                }}>
                <Button id={key}
                        style={{
                            backgroundColor: "#222",
                            backgroundSize: "cover",
                            backgroundImage: coverImage || "",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            borderRadius: "5%",
                            border: "10px black"
                        }}>
                </Button>{date &&
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
                        padding: "0 5px 0 10px"
                    }}>
                    {date}
                </Card.Title>)}
                <Container
                    style={{
                        fontSize: "100%",
                        cursor: "pointer",
                        position: "relative",
                        border: "2px black",
                        width: "100%",
                        visibility: cardState.name ? "visible" : "hidden"
                    }}>
                    {game.name}
                </Container>
            </Card.Body>
        </Card>
    )
}

export default CalendarCard;