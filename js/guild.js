document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "http://localhost:3000/api";
  const guildModal = document.getElementById("guildModal");
  const guildForm = document.getElementById("guildForm");
  const addGuildBtn = document.getElementById("addGuildBtn");
  const modalTitleGuild = document.getElementById("modalTitleGuild");
  const playerSelect = document.getElementById("guildPlayers");
  let editGuildId = null;

  // Carregar todas as guilds
  const loadGuild = async () => {
    const response = await fetch(`${apiUrl}/guilds`);
    const guilds = await response.json();
    const tableBody = document.querySelector("#guildTable tbody");
    tableBody.innerHTML = "";

    guilds.forEach((guild) => {
      const row = document.createElement("tr");
      row.innerHTML = `
    
                <td class="text-table">${guild.name}</td>
                <td class="text-table">${guild.server}</td>
                <td class="text-table">${
                  guild.players ? guild.players.name : "Sem player"
                }</td>

                <td>
                    <button class="editGuildBtn" data-id="${
                      guild._id
                    }">Editar</button>
                    <button class="deleteGuildBtn" data-id="${
                      guild._id
                    }">Deletar</button>
                </td>
            `;
      tableBody.appendChild(row);
    });

    // Eventos dos botões
    document.querySelectorAll(".editGuildBtn").forEach((button) => {
      button.addEventListener("click", (e) =>
        openEditGuildModal(e.target.dataset.id)
      );
    });

    document.querySelectorAll(".deleteGuildBtn").forEach((button) => {
      button.addEventListener("click", (e) => deleteGuild(e.target.dataset.id));
    });
  };

  const loadPlayersOptions = async () => {
    const response = await fetch(`${apiUrl}/player`);
    const players = await response.json();
    playerSelect.innerHTML = "";

    players.forEach((player) => {
      const option = document.createElement("option");
      option.value = player._id;
      option.textContent = player.name;
      playerSelect.appendChild(option);
    });
  };

  const addGuild = async (guild) => {
    await fetch(`${apiUrl}/guilds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(guild),
    });
    loadGuild();
  };

  const updateGuild = async (id, guild) => {
    await fetch(`${apiUrl}/guilds/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(guild),
    });
    loadGuild();
  };

  const deleteGuild = async (id) => {
    await fetch(`${apiUrl}/guilds/${id}`, {
      method: "DELETE",
    });
    loadGuild();
  };

  const openEditGuildModal = async (id) => {
    editGuildId = id;
    modalTitlePlayer.innerText = "Editar Guilda";

    const response = await fetch(`${apiUrl}/guilds/${id}`);
    if (!response.ok) {
      console.error("Guilda não encontrado");
      return;
    }

    const guild = await response.json();
    await loadPlayersOptions();

    document.getElementById("guildName").value = guild.name;
    document.getElementById("guildServer").value = guild.server;

    // Selecionar os players da guild
    Array.from(playerSelect.options).forEach((option) => {
      option.selected = guild.players.some((p) => p._id === option.value);
    });

    guildModal.style.display = "block";
  };

  const openAddGuildModal = async () => {
    editGuildId = null;
    modalTitleGuild.innerText = "Adicionar Guilda";
    guildForm.reset();
    await loadPlayersOptions();
    guildModal.style.display = "block";
  };

  // Fechar modal
  document.querySelector(".close-guild").addEventListener("click", () => {
    guildModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === guildModal) {
      guildModal.style.display = "none";
    }
  });

  // Submit do formulário
  guildForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedPlayers = Array.from(playerSelect.selectedOptions).map(
      (opt) => opt.value
    );

    const guildData = {
      name: document.getElementById("guildName").value,
      server: document.getElementById("guildServer").value,
      players: selectedPlayers,
    };

    if (editGuildId) {
      await updateGuild(editGuildId, guildData);
    } else {
      await addGuild(guildData);
    }

    guildModal.style.display = "none";
    loadGuild();
  });

  // Inicializar
  addGuildBtn.addEventListener("click", openAddGuildModal);
  loadGuild();
});
