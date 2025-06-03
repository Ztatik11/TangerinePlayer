create database tangerinplayer;
use tangerinplayer;


create table Usuarios(
    ID int PRIMARY KEY AUTO_INCREMENT,
    Usuario VARCHAR(15),
    Nombre VARCHAR(30),
    Apellidos VARCHAR(50),
    Email VARCHAR(100),
    Clave VARCHAR(355),
    Fecha_nacimiento DATE,
    UNIQUE(Usuario,Email)
);

create table Playlists(
    ID int PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(50),
    ID_Usuario int,
	Constraint fk_ID_Usuario_Playlist foreign key (ID_Usuario) references Usuarios(ID)
);

create table Canciones(
    trackid VARCHAR(200) PRIMARY KEY,
    url VARCHAR(400),
    title VARCHAR(50),
    artist VARCHAR(100),
    artwork VARCHAR(300)
);

create table Playlist_canciones(
	ID int PRIMARY KEY AUTO_INCREMENT,
	ID_Playlist int,
    ID_Cancion VARCHAR(200),
    Constraint fk_ID_Playlist foreign key (ID_Playlist) references Playlists(ID),
    Constraint fk_ID_Cancion foreign key (ID_Cancion) references Canciones(trackid)
)