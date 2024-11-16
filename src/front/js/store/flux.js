const getState = ({ getStore, getActions, setStore }) => {
	return {
	  store: {
		message: null,
		demo: [
		  {
			title: "FIRST",
			background: "white",
			initial: "white",
		  },
		  {
			title: "SECOND",
			background: "white",
			initial: "white",
		  },
		],
		userLoggedIn: localStorage.getItem('jwt-token'),
	  },
	  actions: {
		exampleFunction: () => {
		  getActions().changeColor(0, "green");
		},
		getMessage: async () => {
		  try {
			const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
			const data = await resp.json();
			setStore({ message: data.message });
			return data;
		  } catch (error) {
			console.log("Error loading message from backend", error);
		  }
		},
		changeColor: (index, color) => {
		  const store = getStore();
		  const demo = store.demo.map((elm, i) => {
			if (i === index) elm.background = color;
			return elm;
		  });
		  setStore({ demo: demo });
		},
		signup: async (email, password, nombre, apellido, ciudad) => {
		  try {
			const resp = await fetch(process.env.BACKEND_URL + "/signup", {
			  method: "POST",
			  headers: {
				"Content-Type": "application/json",
			  },
			  body: JSON.stringify({
				email,
				password,
				nombre: nombre,
				apellido: apellido,
				ciudad,
			  }),
			});
		
			if (!resp.ok) {
			  const data = await resp.json();
			  throw new Error(data.message);
			}
		
			const data = await resp.json();
			// Guardar el token en el localStorage
			localStorage.setItem("jwt-token", data.token);
		
			return data;
		  } catch (error) {
			throw new Error(`Error Durante el registro: ${error.message}`);
		  }
		},
		login: async (email, password) => {
		  try {
			const resp = await fetch(process.env.BACKEND_URL + "/login", {
			  method: "POST",
			  headers: { "Content-Type": "application/json" },
			  body: JSON.stringify({ email, password }),
			});
		
			if (!resp.ok) {
			  if (resp.status === 401) {
				throw new Error("Credenciales Invalidas");
			  } else if (resp.status === 400) {
				throw new Error("Email o Password Invalidos");
			  } else {
				throw new Error("Error Login");
			  }
			}
		
			const data = await resp.json();
		
			localStorage.setItem("jwt-token", data.token);
			setStore({userLoggedIn:localStorage.getItem("jwt-token")})
			return data;
		  } catch (error) {
			throw new Error(`Error during login: ${error.message}`);
		  }
		},
		logout: async () => {
		  try {
			const resp = await fetch(process.env.BACKEND_URL + "/logout", {
			  method: "POST",
			  headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
			  },
			});
		
			if (!resp.ok) {
			  throw new Error("Error during logout request");
			}
		
			localStorage.removeItem("jwt-token");
			setStore({userLoggedIn: null})
		
			return true;
		  } catch (error) {
			throw new Error(`Error Cerrar Sesion: ${error.message}`);
		  }
		},
		getMessage: async () => {
		  try {
			const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
			const data = await resp.json();
			setStore({ message: data.message });
		  } catch (error) {
			console.error("Error loading message from backend", error);
		  }
		},
		getUserData: async (user_id) => {
		  try {
			const response = await fetch(
			  `${process.env.BACKEND_URL}/private/${user_id}`,
			  {
				method: "GET",
				headers: {
				  "Content-Type": "application/json",
				  Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
				},
			  }
			);
  
			if (response.status === 200) {
			  const data = await response.json();
			  return data;
			} else {
			  throw new Error("Error al obtener datos del usuario");
			}
		  } catch (error) {
			throw new Error(`Error fetching user data: ${error.message}`);
		  }
		},
		checkLogin: ()=>{
		  if (localStorage.getItem('jwt-token') != null)
			setStore({userLoggedIn: true})
		}
	  },
	};
  };
  
  export default getState;