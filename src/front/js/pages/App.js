import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import Inicio from "../component/Inicio";

export const App = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<Inicio />
		</div>
	);
};