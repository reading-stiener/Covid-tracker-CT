console.log("script started");
d3.json("https://api.covidtracking.com/v1/us/daily.json", (error, data) => {
  if (error) { 
    return console.warn(error)
  }
  console.log("hello");
  console.log(data);
})
console.log("script ended");