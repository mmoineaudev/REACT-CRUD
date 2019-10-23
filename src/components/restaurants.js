import React from"react";
import"./restaurants.css"
// import { makeStyles } from '@material-ui/core/styles';   
// import Button from '@material-ui/core/Button';
// const useStyles = makeStyles(theme => ({
//   button: {
//     margin: theme.spacing(1),
//   },
//   input: {
//     display: 'none',
//   },
// }));

class Restaurants extends React.Component {
  constructor(props) {
    console.log("-> constructor(props)");
    super(props);
    this.state = {
      list: [],
      page: 1,
      pagination: 15,
      indexRestaurantAModifier: -1
    };
  }
  /**
   * Factorisation de l'affichage du pager
  */
 pagerRender() {
  //console.log("-> pagerRender()");
  return <div id="pager">
      {(this.state.page>1)?<button onClick={() => this.changePage("-")}>Page précédente</button>:<button >Page précédente</button>} 
      &nbsp;&nbsp;&nbsp; {this.state.page} &nbsp;&nbsp;&nbsp; 
      <button onClick={() => this.changePage("+")}>Page suivante</button>
      <div> 
        <button onClick={() => this.changePagination("-")}>Réduire la pagination</button>
        <button onClick={() => this.changePagination("+")}>Augmenter la pagination</button>
      </div>
    </div> ;
}
/**
 * Appelle refreshList pour changer la page courante
 * @param {*} arg 
 */
changePage(arg) {
  //console.log("-> changePage(arg)");
  let oldpage = this.state.page;
  this.refreshList((arg==="-")?oldpage-1:oldpage+1, this.state.pagination);
  //console.log("changePage", arg)
}
changePagination(arg){
    //console.log("-> changePage(arg)");
    let oldpagination = this.state.pagination;
    this.refreshList(this.state.page, (arg==="-" )?oldpagination-1:oldpagination+1);
    //console.log("changePage", arg)
}


  /**
   * delete a restaurant
   * (pris de l'ancien TD)
   */
  deleteRequest(data) {
    let id = data._id; 
    let url = "http://localhost:8080/api/restaurants/" + id;
    fetch(url, {
        method: "DELETE",
        body: data
    })
    .then(function(responseJSON) {
        responseJSON.json()
            .then(function(res) {
                console.log(res);
            });
        })
        .catch(function (err) {
            console.log(err);
    });
  }
  /**
   * supprime juste avant de filtrer
   * @param {*} aKey 
   */
  removeRestaurant(aKey) {
    //console.log("-> removeRestaurant(aKey)");
    const oldList = this.state.list;
    const newList =  oldList.filter((element) => {
      if(element._id===aKey) {
        console.log("to delete -> ",element)
        this.deleteRequest(element);
      }
      return ((element._id!==aKey)?element:null);
    });
    console.log("removeRestaurant newList",newList);    
    this.refreshList(this.state.page, this.state.pagination, this.state.indexRestaurantAModifier, newList);
    console.log("removeRestaurant",this.state.list);
  }
  
  /**
   * Factorisation de l'affichage des champs pour créer un restaurant
   */
  addRestaurantRender() {
    return <div><h2>Ajouter un restaurant</h2>
      <div >
            <label>Nom</label>
            <input  ref={(restaurantInput) => this.restaurantInput = restaurantInput}  
            type="text" name="nom" required placeholder="Un restaurant"></input>
        </div>
        <div >
            <label>Quartier</label>
            <input  ref={(quartierInput) => this.quartierInput = quartierInput} 
            type="text" name="quartier" required placeholder="Un quartier"></input>
        </div>
        <div >
            <label>Cuisine</label>
            <input  ref={(cuisineInput) => this.cuisineInput = cuisineInput} 
            type="text" name="cuisine" required placeholder="Un cuisine"></input>
        </div>
        <button onClick={()=> {this.addRestaurant(this.restaurantInput.value, this.cuisineInput.value, this.quartierInput.value)} }>
        Créer restaurant</button> 
    </div>;
  }
  /**
   * En provenance du td précédent 
   * @param {*} data 
   */
  postRequest(data) {
    let url = "http://localhost:8080/api/restaurants";
    fetch(url, {
        method: "POST",
        body: data
    })
    .then(function(responseJSON) {
        responseJSON.json()
            .then(function(res) {
                console.log(res);
            });
        })
        .catch(function (err) {
            console.log(err);
    });
  }
  /**
   * Ajout d'un restaurant dans la base
   * @param {*} restaurant 
   * @param {*} cuisine 
   */
  addRestaurant(restaurant, cuisine, quartier) {
    let newOne = {"_id": Math.ceil(Math.random()*10000), "name":restaurant, "cuisine":cuisine, "borough":quartier};
    this.postRequest(newOne);
    this.refreshList(this.state.page, this.state.pagination, this.state.indexRestaurantAModifier, this.state.list.concat(newOne));
  }

  /**
   * A
   * @param {*} id 
   * @param {*} index 
   */
  displayModifierRestaurant(id, index){
    this.idAModifier = id; 
    console.log("displayModifierRestaurant",this.idAModifier, this.indexAModifier);

    this.setState({indexRestaurantAModifier:index});
    console.log("displayModifierRestaurant",this.idAModifier, this.indexAModifier);
  }
  //ne met pas a jour la page dynamiquement (?)
  modifierRestaurantRender(){
      let target = this.state.list[this.state.indexRestaurantAModifier];
      console.log("modifierRestaurantRender", this.state.list[this.state.indexRestaurantAModifier]);
      let content = <div></div>;//wololo
      if(this.state.indexRestaurantAModifier>-1){
        content = <div ref={(formContainer) => this.formContainer = formContainer}>
          <h2>Formulaire de modification</h2>
          <label>Modifier <b>{target.name}</b>({target._id})</label>
          <br></br>
          <div >
              <label>Nom</label>
              <input  ref={(modifierNameInput) => this.modifierNameInput = modifierNameInput}  type="text" name="nom" 
              required placeholder={(target._id)?target.name:"un nom"}></input>
          </div>
          <div >
              <label>Quartier</label>
              <input  ref={(modifierBoroughInput) => this.modifierBoroughInput = modifierBoroughInput}  type="text" name="nom" 
              required placeholder={(target._id)?target.borough:"un quartier"}></input>
          </div>
          <div >
            <label>Cuisine</label>
            <input  ref={(modifierCuisineInput) => this.modifierCuisineInput = modifierCuisineInput} type="text" name="cuisine" 
            required placeholder={(target._id)?target.cuisine:"une cuisine"}></input>
          </div>
          <button onClick={()=> { this.putRequest(target._id) } }>
            Appliquer les modifications
          </button> 
        </div> ;
      } 
      return <div ref={(displayModifier) => this.displayModifier = displayModifier}>
        {content}
      </div>;
  }
  /**
   * Methode PUT de l'ancien TD 
   * @param {*} id 
   */
  async putRequest(id) {
    let url = "http://localhost:8080/api/restaurants/" + id;
    const newVersion = this.state.list[this.state.indexRestaurantAModifier];
    newVersion.name = this.modifierNameInput.value;
    newVersion.borough = this.modifierBoroughInput.value; 
    newVersion.cuisine = this.modifierCuisineInput.value; 
    console.log("objet modifié", newVersion)
    await fetch(url, {
        method: "PUT",
        body: newVersion
    })
    .then(function(responseJSON) {
        responseJSON.json()
            .then(function(res) {
                console.log(res); //pourquoi au reload l'objet est vide ?
            });
        })
        .catch(function (err) {
            console.log(err);
    });
    this.setState({indexAModifier:-1});//devrait normalement désafficher le formulaire

  }

  /**
   * Pour éviter toute situation difficile avec les erreurs liées à l'utilisation du setstate, 
   * je mets tout là
   * @param {*} aPage 
   * @param {*} aPagination 
   * @param {*} aList 
   */
  async refreshList(aPage, aPagination, indexAModifier, aList) {
    console.log("-> async refreshList()", {aPage}, {aPagination}, {aList});
    if(!aList){
      const newList = await fetch('http://localhost:8080/api/restaurants?page='+aPage+'&pagesize='+aPagination) 
      .then(res => res.json());
      console.log(newList);
      this.setState({
        page:aPage,
        pagination:(aPagination>0)?aPagination:1,
        indexRestaurantAModifier: indexAModifier,
        list:newList.data
      });
    }else{
      this.setState({
        page:aPage,
        pagination:(aPagination>0)?aPagination:1,
        indexRestaurantAModifier: indexAModifier,
        list:aList
      });
    }
    console.log(this.state)
  }
  /**
   * La méthode componentDidMount charge le contenu du composant avec les paramètres d'états 
   * du moment de l'appel
   */
  componentDidMount = async () => {
    this.refreshList(this.state.page, this.state.pagination);
    console.log("componentDidMount",this.state.list);
  }

  /**
   * La méthode render retourne le composant sous format HTML
   */
  render() {
    console.log("-> render()");
    let rendering = <ul> 
    {this.state.list.map( (element) => 
      <li key={element._id} > {element.name} ({element.borough}) - {element.cuisine} 
      <span> &nbsp; </span><button onClick={() => this.removeRestaurant(element._id)}>Supprimer</button>
      <span> &nbsp; </span><button onClick={() => this.displayModifierRestaurant(element._id, this.state.list.indexOf(element))}>Modifier</button>
      </li> 
      )
    } </ul>; 

    const pager = this.pagerRender();
    return <div>
      {this.addRestaurantRender()}
      {this.modifierRestaurantRender()}
      <div><h2>Les restaurants en base</h2>
      {pager}       
      {rendering}
      {pager}
      </div>
    </div>;
  }

  doNothing(){
    return null;
  }


}

export default Restaurants;
