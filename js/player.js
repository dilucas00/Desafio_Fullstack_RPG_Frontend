document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "http://localhost:3000/api";
  const playerModal = document.getElementById("playerModal");
  const playerForm = document.getElementById("playerForm");
  const addPlayerBtn = document.getElementById("addPlayerBtn");
  const modalTitlePlayer = document.getElementById("modalTitlePlayer");
  let editPlayerId = null;

  // Carregar todos os players
  const loadPlayer = async () => {
    const response = await fetch(`${apiUrl}/player`);
    const players = await response.json();
    const tableBody = document.querySelector("#playerTable tbody");
    tableBody.innerHTML = "";

    players.forEach((player) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td class="text-table">${player.name}</td>
                <td class="text-table">${player.level}</td>
                <td class="text-table">${player.classPlayer}</td>
                <td class="text-table">${player.equipament}</td>
                <td>
                    <button class="editPlayerBtn" data-id="${player._id}">Editar</button>
                    <button class="deletePlayerBtn" data-id="${player._id}">Deletar</button>
                </td>
            `;
      tableBody.appendChild(row);
    });

    // Eventos dos botões
    document.querySelectorAll(".editPlayerBtn").forEach((button) => {
      button.addEventListener("click", (e) =>
        openEditPlayerModal(e.target.dataset.id)
      );
    });

    document.querySelectorAll(".deletePlayerBtn").forEach((button) => {
      button.addEventListener("click", (e) =>
        deletePlayer(e.target.dataset.id)
      );
    });
  };

  const addPlayer = async (player) => {
    await fetch(`${apiUrl}/player`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(player),
    });
    loadPlayer();
  };

  const updatePlayer = async (id, player) => {
    await fetch(`${apiUrl}/player/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(player),
    });
    loadPlayer();
  };

  const deletePlayer = async (id) => {
    await fetch(`${apiUrl}/player/${id}`, {
      method: "DELETE",
    });
    loadPlayer();
  };

  const openEditPlayerModal = async (id) => {
    editPlayerId = id;
    modalTitlePlayer.innerText = "Editar Player";

    const response = await fetch(`${apiUrl}/player/${id}`);
    if (!response.ok) {
      console.error("Player não encontrado");
      return;
    }

    const player = await response.json();

    document.getElementById("namePlayer").value = player.name;
    document.getElementById("classPlayer").value = player.classPlayer;
    document.getElementById("equipament").value = player.equipament;
    document.getElementById("level").value = player.level;

    playerModal.style.display = "block";
  };

  const openAddPlayerModal = () => {
    editPlayerId = null;
    modalTitlePlayer.innerText = "Adicionar Player";
    playerForm.reset();
    playerModal.style.display = "block";
  };

  // Fechar modal
  document.querySelector(".close").addEventListener("click", () => {
    playerModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === playerModal) {
      playerModal.style.display = "none";
    }
  });

  // Submit do formulário
  playerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const playerData = {
      name: document.getElementById("namePlayer").value,
      level: parseInt(document.getElementById("level").value),
      classPlayer: document.getElementById("classPlayer").value,
      equipament: document.getElementById("equipament").value,
    };

    if (editPlayerId) {
      await updatePlayer(editPlayerId, playerData);
    } else {
      await addPlayer(playerData);
    }

    playerModal.style.display = "none";
    loadPlayer();
  });

  // Inicializar
  addPlayerBtn.addEventListener("click", openAddPlayerModal);
  loadPlayer();
});
