import Card from "react-bootstrap/Card";
import {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import {platforms} from "../Shared/SharedVariables.tsx";

interface CardState {
    name: string;
}

function CalendarCard(props: any) {
    const [cardState, setCardState] = useState<CardState>();
    const game = props.game;
    const date = props.date;
    const coverImage = props.coverImage;
    const key = props.id + game.id + "bkgd";
    const today = new Date();
    const month = props.month;
    let gamePlatforms = game.platforms.map((p: number) => platforms[p]).join('\n');
    let nameContainer = document.getElementById(key + "name");
    let cardContainer = document.getElementById(key + "card");

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
        <Card id={key + "card"}
              style={{
                  borderRadius: "3%",
                  border: date === new Date().getDate()
                      ? "solid 2px rgb(185, 161, 30)"
                      : 'solid 4px black',
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
                </Button>
                {date &&
                    (<Card.Title
                        style={{
                            position: "absolute",
                            textAlign: "right",
                            color: "white",
                            fontWeight: 650,
                            backgroundColor: date === today.getDate() && month === today.getMonth()
                                ? "rgb(185, 161, 30)"
                                : "#222",
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
                        position: "absolute",
                        textAlign: "right",
                        color: "white",
                        fontSize: "75%",
                        fontWeight: 600,
                        backgroundColor: date === new Date().getDate() && month === today.getMonth()
                            ? "rgb(185, 161, 30)"
                            : "#222",
                        borderRadius: "20px 0 0 0",
                        boxShadow: "-2px -2px 10px black",
                        textWrap: "nowrap",
                        bottom: 0,
                        right: 0,
                        minWidth: "20px",
                        maxWidth: "100%",
                        width: "fit-content",
                        //maxHeight: "150%",
                        padding: "0 5px 0 10px",
                        overflow: "hidden",
                        whiteSpace: "pre-wrap",
                        visibility: cardState.name ? "visible" : "hidden"
                    }}>
                    {gamePlatforms}
                </Container>
                <Container
                    id={key + "name"}
                    style={{
                        fontSize: nameContainer && cardContainer && nameContainer!.offsetHeight > cardContainer!.offsetHeight
                            ? "75%" : "100%",
                        cursor: "pointer",
                        position: "relative",
                        border: "2px black",
                        width: "100%",
                        visibility: cardState.name ? "visible" : "hidden",
                        display: "flex",
                        flex: 1,
                        //wordBreak: "break-word",
                    }}>
                    {game.name}
                </Container>
            </Card.Body>
        </Card>
    )
}

export default CalendarCard;