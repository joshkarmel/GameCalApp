import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {CardGroup} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import {months, days} from '../Shared/SharedVariables';
import EmptyCalendarCard from "./EmptyCalendarCard";
import CalendarCard from "./CalendarCard.tsx";

function CardCalendar(props: any) {
    const currentMonth = props.currentMonth;
    const generateMonth = () => {
        let monthOffset: number = currentMonth.dates[0].releaseDate.getDay();
        let dayCards: any[] = [];
        for (let i: number = 0; i < monthOffset; i++) {
            dayCards.push(
                <Col key={"offset" + i} style={{width: "100%"}}>
                    <EmptyCalendarCard grey/>
                </Col>);
        }

        for (let i: number = 0; i < currentMonth.dates.length; i++) {
            let games = currentMonth.dates[i].games;
            let sortedByRatingCount = games.sort((a: any, b: any) => b.ratingCount - a.ratingCount);
            let game = sortedByRatingCount[0];
            let releaseDate = currentMonth.dates[i].releaseDate.getDate();
            if (game !== undefined) {
                let coverImage = game.cover != "0"
                    && `url("//images.igdb.com/igdb/image/upload/t_cover_big/` + game.coverImage.image_Id + `.jpg")`;
                dayCards.push(
                    <Col key={"CalendarCard_" + game.id + game.name + i}>
                        <CalendarCard date={releaseDate} game={game} coverImage={coverImage}
                                      id={i}
                                      style={{
                                          width: "100%",
                                          maxWidth: "125px",
                                          alignContent: "center",
                                          fontSize: "inherit",
                                      }}/>
                    </Col>
                );
            } else {
                dayCards.push(
                    <Col key={"noGame" + i} style={{width: "100%"}}>
                        <EmptyCalendarCard date={releaseDate}/>
                    </Col>);
            }
        }

        for (let i: number = 0; i < 42 - (monthOffset + currentMonth.dates.length); i++) {
            dayCards.push(<EmptyCalendarCard key={"end" + i} grey/>);
        }

        const calendarCards: any[][] = [days, days, days, days, days, days];
        return calendarCards.map((week: any, index: number) =>
            <Row lg={7} md={7} xs={7} sm={7} key={"week" + index}>
                <CardGroup>
                    {
                        Array.from(week, (_: any, i: number) => {
                            return dayCards[index * 7 + i]
                        })
                    }
                </CardGroup>
            </Row>
        )
    }

    return (<Container fluid>
            <Row className="justify-content-center"
                 style={{color: "white", fontWeight: "bold", fontSize: "20px", alignContent: "center"}}>
                <Col xs lg={2}>
                    <Button>{"<"}</Button>
                </Col>
                <Col md="auto">
                    {months[currentMonth.monthId - 1]}&nbsp;
                    {currentMonth.year}
                </Col>
                <Col xs lg={2}>
                    <Button>{">"}</Button>
                </Col>
            </Row>
            <Row lg={7} md={7} xs={7} sm={7} style={{height: "30px"}}>
                <CardGroup className="mb-3">
                    {days.map((day: string) =>
                        <Col key={day}>
                            <Card style={{
                                height: "30px",
                                borderRadius: "10px 10px 0 0",
                                borderColor: "black",
                                backgroundColor: "#222",
                                color: "white",
                                fontWeight: 650,
                                textShadow: "2px 2px 2px black",
                                
                            }}>
                                {day}
                            </Card>
                        </Col>
                    )}
                </CardGroup>
            </Row>
            {generateMonth()}
        </Container>
    )
}

export default CardCalendar;