import axios from "axios";
import redisClient from "../config/redis.js";

const getPokemon = async (req, res) => {
  try {
    const name = req.params.name.toLowerCase();
    const key = `pokemon:${name}`;

    console.log("🔎 Checking cache...");

    let cached = null;
    try {
      cached = await redisClient.get(key);
    } catch (err) {
      console.log("Redis read error:", err.message);
    }

    if (cached) {
      console.log("⚡ Cache HIT");
      return res.json(JSON.parse(cached));
    }

    console.log("❌ Cache MISS - fetching from PokeAPI...");

    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${name}`
    );

    const data = response.data;

    const result = {
      name: data.name,
      id: data.id,
      height: data.height,
      weight: data.weight,
      types: data.types.map(t => t.type.name),
      abilities: data.abilities.map(a => a.ability.name),
      sprite: data.sprites.front_default,
    };

    // ✅ FIXED Redis SET
    try {
      await redisClient.set(key, JSON.stringify(result), "EX", 60);
    } catch (err) {
      console.log("Redis write error:", err.message);
    }

    console.log("💾 Saved to cache");

    res.json(result);

  } catch (error) {
    console.error("Controller error:", error.message);
    res.status(500).json({ message: "Error fetching pokemon" });
  }
};

export default getPokemon;