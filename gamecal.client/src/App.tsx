import {useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import './App.css';
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import CardCalendar from "./Components/CardCalendar.tsx"
import {months} from "./Shared/SharedVariables.tsx";
import CalendarCard from "./Components/CalendarCard.tsx";

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

export interface Month {
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

    useEffect(() => {
        const fetchGameData = async () => {
            //let today = new Date(Date.now());
            await populateGameData(2, 2025);
        }
        fetchGameData().catch(error => console.log(error));
    }, []);

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

    const calendar = state === undefined || state.datesGames === undefined
        ? <Spinner/>
        : <CardCalendar currentMonth={state.currentMonth}/>

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
                            <Row lg={7} md={7} xs={7} sm={7}>
                                {date.games.map((game: GameData) => {
                                        let coverImage = game.cover != "0"
                                            && `url("//images.igdb.com/igdb/image/upload/t_cover_big/` + game.coverImage.image_Id + `.jpg")`;
                                        return (
                                            <Col key={game.id + game.name} style={{padding: "0"}}>
                                                <CalendarCard game={game} coverImage={coverImage} width={"auto"}
                                                              style={{width: "auto", fontSize: "2rem"}}/>
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
            let date: Date = month !== null && year !== null && sortedData[0].releaseDate;
            setState({
                ...state,
                datesGames: sortedData,
                currentMonth: updateMonth(date.getMonth() + 1, date.getFullYear(), sortedData)
            });
        }
    }
}

export default App;