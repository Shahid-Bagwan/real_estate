- browserrouter,routes,route = it is use to handle routing.
- .env file = if you are using private passwords/tokens you should use env to hide it from public.
- node js is mandatory.
- express helps us to write server code in small number of lines.
- (req,res,next){}
- req = it has everything send by the client. for ex : location,device,some input data.
- res = the data we send from the server(our side) is in res. for ex : pages,used data etc.
- next is use to transfer control to next function.
- route parameters are /{router parameter} this is route parameter.
- dynamic routing means, a route which is same but only some aspect are going to be changed & we add a variable to it. you can us ' : ' at the place you want to make it dyanamic.
- template engine : it is use to convert ejs file to html.
- ejs: it's  a type of file which is similar to html but can render data dyanmically.
- error handling: we can use error handling using error handling function" (throw Error());"
- static files: 'app.use(express.static('./public))' this code sets the "public folder", where it can find the static files(html,css,js,images);
- "const userSchema = new mongoose.Schema({" use to create a structure of data,like type,required etc. so that the proper data is processed. 
- MVCR - (model, view, controller, Routes) it is used to manage the code properly.
 we create route handling files. model for creating a structure. controller to perform certain task using the model. 
 - encrypting password (bcrypt pkg).
 - jwt(jsonwebtoken) it is used create an auth token
 - cookie
 - redux = redux is used for state management. some important concepts {store,reducers,slice,useSelector,useDispatch, payload,state}.
 - store is a common store house from where every component can get access.
 - reducers are the functions which are use to modify states.
 - slice is the term for the funcs.
 - useSelector is used to get data from the store. it uses slice(reducer) to do so.
 - useDispatch is used to modify/perform action on data from the store. it uses slice(reducer) to do so.
 - payload & state are the parameters we get. we can use it to our needs.
 - redux persist is use to save the data to local storage.
 - ### never set the key and value with same word( ex : verifyuser)