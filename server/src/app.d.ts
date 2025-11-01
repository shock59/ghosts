type Coordinates = [number, number];
type Command = [string, unknown];
type SessionEntry = [0, Coordinates] | [1, Command] | [2, number];
type Session = SessionEntry[];
