import counts from "./counts.json" assert { type: "json" };

let owner = "123456";

for (var i = 0; i < counts.length; i++) {
  if (counts[i].owner == owner) {
    console.log(counts[i].count);
  }
}
