import {useEffect, useState} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import './App.css';
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import {CardGroup} from "react-bootstrap";

interface GameData {
    firstReleaseDate: string;
    releaseDate: Date;
    releaseDates: Array<Date>;
    name: number;
    id: number;
    platform: string;
    cover: string;
    coverImage: CoverImage;
    ratingCount: number;
}

interface CoverImage {
    url: string;
    image_Id: string;
    id: number;
    height: number;
    width: number;
}

interface DateGames {
    releaseDate: Date;
    games: GameData[];
}

interface Month {
    monthId: number;
    name: string;
    dates: DateGames[];
    year: number;
}

interface State {
    datesGames: DateGames[];
    currentMonth: Month;
}

function App() {
    const [state, setState] = useState<State>();

    const defaultMonth: Month = {
        monthId: 0,
        name: "",
        dates: [],
        year: 0,
    }

    // const defaultDate: DateGames = {
    //     releaseDate: new Date(),
    //     games: []
    // }

    useEffect(() => {
        const fetchGameData = async () => {
            let today = new Date(Date.now());
            await populateGameData(2, 2022);
        }
        fetchGameData().catch(error => console.log(error));
    }, []);

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var calendarCards: any[][] = [days, days, days, days, days, days];

    const updateMonth = (monthId: number, year: number, datesGames: DateGames[]) => {
        var daysInMonth = new Date(year, monthId, 0).getDate();
        var monthDates: DateGames[] = [...Array(daysInMonth).keys()].map((day) => {
            var dateGames = datesGames.find((dateGame) => {
                let month = dateGame.releaseDate.getMonth() + 1;
                let releaseDay = dateGame.releaseDate.getDate() - 1;
                let releaseYear = dateGame.releaseDate.getFullYear();
                return month == monthId &&
                    releaseDay == day &&
                    releaseYear == year;
            });
            return dateGames ?? {
                releaseDate: new Date(year, monthId - 1, day + 1),
                games: []
            };
        });
        let currentMonth: Month = {
            monthId: monthId,
            name: months[monthId],
            dates: monthDates,
            year: year,
        };
        return currentMonth;
    }

    const emptyCard: any = (id: string) => {
        return <Col key={"empty" + id} style={{width: "100%"}}>
            <Card style={{height: "150px", width: "170px", backgroundColor: "grey"}}>
            </Card>
        </Col>
    }

    const generateMonth = () => {
        let releaseMonth: Month = state !== undefined ? state.currentMonth : defaultMonth;
        let monthOffset: number = releaseMonth.dates[0].releaseDate.getDay();
        let dayCards: any[] = [];
        for (let i: number = 0; i < monthOffset; i++) {
            dayCards.push(emptyCard("offset" + i));
        }

        for (let i: number = 0; i < releaseMonth.dates.length; i++) {
            let games = releaseMonth.dates[i].games;
            let sortedByRatingCount = games.sort((a, b) => b.ratingCount - a.ratingCount);
            let game = sortedByRatingCount[0];
            if (game !== undefined) {
                let coverImage = game.cover != "0"
                    && `url("//images.igdb.com/igdb/image/upload/t_cover_big/` + game.coverImage.image_Id + `.jpg")`;
                dayCards.push(
                    <Col key={game.id + game.name}>
                        <Card key={game.id}
                              style={{
                                  borderRadius: "inherit",
                                  border: 'solid 4px darkblue',
                                  height: "150px",
                                  width: "170px",
                              }}>
                            <Card.Title>{releaseMonth.dates[i].releaseDate.getDate()}</Card.Title>
                            <Button style={{
                                fontSize: "inherit",
                                fontWeight: 750,
                                textShadow: "2px 2px 2px black",
                                backgroundSize: "cover",
                                backgroundImage: coverImage || "",
                                backgroundColor: "blue",
                                //backgroundBlendMode: "multiply",
                                alignContent: "center",
                                textOverflow: "clip",
                                border: "2px black",
                                borderRadius: "inherit",
                                stroke: "black",
                                strokeWidth: "3px",
                                height: "100%"
                            }}>
                                {game.name}
                            </Button>
                        </Card>
                    </Col>
                );
            } else {
                dayCards.push(
                    <Col key={"empty" + i}>
                        <Card style={{height: "150px", width: "170px"}}>
                            <Card.Title>{releaseMonth.dates[i].releaseDate.getDate()}</Card.Title>
                        </Card>
                    </Col>);
            }
        }

        for (let i: number = 0; i < 42 - (monthOffset + releaseMonth.dates.length); i++) {
            dayCards.push(emptyCard("end" + i));
        }

        return calendarCards.map((week: any, index: number) =>
            (<Row key={"week" + index}>
                <CardGroup>
                    {
                        week.map((day: any, i: number) => {
                            return dayCards[(index * 7) + i]
                        })
                    }
                </CardGroup>
            </Row>)
        )
    }

    const calendar = state === undefined || state.datesGames === undefined
        ? <Spinner/>
        : <Container fluid>
            <Row className="justify-content-center" style={{color: "white", fontWeight: "bold", fontSize: "20px"}}>
                <Col xs lg={2}>
                    <Button>{"<"}</Button>
                </Col>
                <Col md="auto">
                    {state && months[state.currentMonth.monthId - 1]}&nbsp;
                    {state && state.currentMonth.year}
                </Col>
                <Col xs lg={2}>
                    <Button>{">"}</Button>
                </Col>
            </Row>
            <Row lg={7} md={7} xs={7} style={{height: "30px"}}>
                <CardGroup className="mb-3">
                    {days.map((day: string) =>
                        <Col key={day}>
                            <Card style={{height: "30px"}}>
                                {day}
                            </Card>
                        </Col>
                    )}
                </CardGroup>
            </Row>
            {generateMonth()}
        </Container>

    const contents = state === undefined || state.datesGames === undefined
        ? <div style={{color: "white"}}>
            <Spinner animation="border" role="status" variant="primary"/>
            <div>
                <em>
                    Loading... Please refresh once the ASP.NET backend has started. See
                    <a href="https://aka.ms/jspsintegrationreact"> https://aka.ms/jspsintegrationreact </a>
                    for more details.
                </em>
            </div>
        </div>
        :
        <Container style={{alignContent: "center"}}>
            {state.datesGames.map((date: DateGames) =>
                (<Row key={date.releaseDate.toLocaleDateString()}
                      style={{
                          alignContent: "center",
                          paddingBottom: "10px",
                          textOverflow: "clip"
                      }}
                    >
                        <Col lg={1} style={{color: "#f1f1f1", alignContent: "center"}}>
                            {date.releaseDate.toLocaleDateString()}
                        </Col>
                        <Col>
                            <Row>
                                {date.games.map((game: GameData) => {
                                        let coverImage = game.cover != "0"
                                            && `url("//images.igdb.com/igdb/image/upload/t_cover_big/` + game.coverImage.image_Id + `.jpg")`;
                                        return (
                                            <Col key={game.id + game.name} style={{padding: "0"}}>
                                                <Card key={game.id}
                                                      style={{
                                                          borderRadius: "inherit",
                                                          border: 'solid 4px darkblue',
                                                      }}>
                                                    <Button style={{
                                                        fontSize: "2rem",
                                                        fontWeight: 750,
                                                        textShadow: "2px 2px 2px black, -2px -2px -2px black",
                                                        backgroundSize: "cover",
                                                        backgroundImage: coverImage || "",
                                                        backgroundColor: "blue",
                                                        //backgroundBlendMode: "multiply",
                                                        textOverflow: "clip",
                                                        width: "auto",
                                                        height: "200px",
                                                        border: "2px black",
                                                        borderRadius: "inherit"
                                                    }}>
                                                        {game.name}
                                                    </Button>
                                                </Card>
                                            </Col>
                                        )
                                    }
                                )}
                            </Row>
                        </Col>
                    </Row>
                )
            )}
        </Container>

    return (
        <div>
            <h1 id="tableLabel">GameDay</h1>
            {calendar}
            {contents}
        </div>
    );

    async function populateGameData(month: number, year: number) {
        const response = await fetch('gamedata');
        if (response.ok) {
            const data = await response.json();
            let sortedData = data
                .sort((a: GameData, b: GameData) => Date.parse(a.firstReleaseDate) - Date.parse(b.firstReleaseDate))
                .map((gameData: DateGames) => {
                    return {
                        games: gameData.games,
                        releaseDate: new Date(gameData.releaseDate)
                    };
                })
            let date:Date = sortedData[0].releaseDate;
            setState({
                ...state,
                datesGames: sortedData,
                currentMonth: updateMonth(date.getMonth() + 1, date.getFullYear(), sortedData)
            });
        }
    }
}

export default App;