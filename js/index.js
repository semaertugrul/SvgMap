//Javascript Kodları Burda
//TagName path id si svg-turkey-map olanhtml elemaları svgTurkeyMap değişkenine atanır.     
var svgTurkeyMap = document.getElementById("svg-turkey-map").getElementsByTagName("path");
//id si city-name olan elemanlar cityName değişkenine atanır.
var cityName = document.getElementById("city-name");
var product = document.getElementById("deneme");

var data = [];
for (i = 0; i < svgTurkeyMap.length; i++) 
{

  //Maouse hareketine bağlı olarak sayfayı dinleyip gerekli işlemleri yapmak için ilgili fonksiyon oluşturulmuştur.
  svgTurkeyMap[i].addEventListener("mousemove", function() {
  //ilgili sehrin uzerine gelindiğinde şehir üzerinde uyun division eklenir(oluşturulur)..
    cityName.classList.add("show-city-name--active");
    //Şehrin üstüne gelince isminin ortaya çıkacağı divisionun konumunu belirler.
    cityName.style.left = (event.clientX + 30 + "px");
    cityName.style.top = (event.clientY + 30 + "px")
    //Aktifleşen divisionda şehrin ismi yazar.
    cityName.innerHTML = this.getAttribute("title")+"<br/>";

  });
 /////////////////////////////////////////////////////////////////////////////////////

 //mouse harita üzerinde bulunduğu konumdan ayrıldığında ilgili fonksiyon çalışır.
  svgTurkeyMap[i].addEventListener("mouseleave", function() {
  //Bulunulan sehrin uzerin ayrılınıldığında division kaldırılır(yok edilir)..
    cityName.classList.remove("show-city-name--active");
  });

///////////////////////////////////////////////////////////////////////////////////////

//mouse ile herhangi bir şehre tıklanıldığında ilgili fonksiyon çalışır.
  svgTurkeyMap[i].addEventListener("click", function() {

//harita htmlindeki şehre ait id1 alınıp id değişkenine atanır.
    var id = this.getAttribute("id1");
    //counter 0 a atanır
    var counter = 0;
    // Database bağlantısı sağlanır.
    var ref1 = firebase.database().ref("sehir");
    //Database de tıklanılan şehrin id sine uygun childe erişilir ve bu erişilen child değeri ref değişkeninde tutulur.
    var ref = ref1.child(id);
//erişilen child değerinin altında ki eleman sayısı belirtilen fonksiyon ile döner ve counter'a atanır.
ref.orderByKey().endAt("pterodactyl").on("child_added", function(snapshot) {
    counter ++;
  //console.log(snapshot.key);
  //console.log("counter son degeri :" + counter);
});

/////////////////////////////////////////////////////////////////////////////////////// 

//Aynı şekilde yine aynı id ye sahip childe erişilir ve bu child in value ları üzeinde işlemler yapılır.
    var ref = firebase.database().ref("sehir").orderByKey().equalTo(id);
    ref.once("value").then(function(snapshot) {
     // console.log(id);
     // console.log(snapshot.val());

///////////////////////////////////////////////////////////////////////////////////////   

 console.log(counter);//Kişisel kontrol amaçlı.
 //ürün isimleri ve miktarlarını ayrı ayrı tutan iki static dizi oluşturulur.
    var array = new Array(counter);
    var array_count= new Array(counter);

//console.log(counter);

   for(var i=0;i<counter;i++){

    //ürün isimleri ve miktarları dizilere tek tek atanır.
      array_count[i] = snapshot.child(id).child(i+1).child("count").val();
      array[i] = snapshot.child(id).child(i+1).child("name").val();
 
    }

    var i,j;
 //////////////////////////////////////////////////////////////////////////
 // Elemanlar miktara(count) göre sıralanırlar ama aynı sıralamayı isimler içinde yapmaz isek ürün adı ve bu ürüne uygun miktar kaybolup gider.
  for(i=0; i<array_count.length;i++)
  { 
    var a=array_count[i];
    var c =parseInt(a);
    
        for(j=i+1; j<array_count.length; j++)
        {
          var b =array_count[j];
          var d=parseInt(b);
        
            if (c<d) 
            {
                var swap_,swap;
                swap_ = array_count[i]; // Dizi[i] yi kaybetmemek için gecicide tutuyoruz
                array_count[i] = array_count[j]; //dizi[i] yi dizi[i] den daha küçük olan dizi[j] kaydediyoruz
                array_count[j] = swap_; // Dizi[j] ye ise dizi[i] değerini kaydediyoruz. Bu değeri gecicide saklamıştık

               swap = array[i]; // Dizi[i] yi kaybetmemek için gecicide tutuyoruz
               array[i] = array[j]; //dizi[i] yi dizi[i] den daha küçük olan dizi[j] kaydediyoruz
               array[j] = swap; // Dizi[j] ye ise dizi[i] değerini kaydediyoruz. Bu değeri gecicide saklamıştık
                
            }
        }
      
  }
  ///////////////////////////////////////////////////////////
  console.log(array_count[0]+" "+array_count[1]+" "+array_count[2]+" "+array_count[3]+" "+
  array_count[4]+" "+array_count[5]+" "+array_count[6]+" "+array_count[7]+" "+array_count[8]); //Kişisel kontrol amaçlı.

  // Load google charts
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);



function drawChart() {
  // Create and populate the data table.

  var data = new google.visualization.DataTable();
  data.addColumn('string', 'years');
  data.addColumn('number', 'sales');
  

  for(i = 0; i < array_count.length; i++){
    var deneme=array_count[i];
    var deneme1 =parseInt(deneme);
    data.addRow([array[i],deneme1]);}

  // Create and draw the visualization.
  new google.visualization.PieChart(document.getElementById('piechart')). //piechart,linechart
  draw(data, {});
}

    
    
      
    });


  });

}


 
 