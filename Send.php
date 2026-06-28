<?php

// Autorise les requêtes POST uniquement
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  echo "error";
  exit;
}

// Récupération sécurisée des données
$name = htmlspecialchars($_POST["name"] ?? "");
$email = htmlspecialchars($_POST["email"] ?? "");
$phone = htmlspecialchars($_POST["phone"] ?? "");
$designType = htmlspecialchars($_POST["designType"] ?? "");
$pack = htmlspecialchars($_POST["pack"] ?? "");
$priority = htmlspecialchars($_POST["priority"] ?? "");
$projectTitle = htmlspecialchars($_POST["projectTitle"] ?? "");
$description = htmlspecialchars($_POST["description"] ?? "");

// Vérification champs obligatoires
if (empty($name) || empty($email) || empty($projectTitle) || empty($designType)) {
  echo "error";
  exit;
}

// Email destinataire
$to = "TONEMAIL@gmail.com"; // <-- change ici

$subject = "📩 Nouvelle commande FlyerCraft";

$message = "
Nouvelle commande :

Nom: $name
Email: $email
Téléphone: $phone

Type de design: $designType
Pack: $pack
Priorité: $priority

Titre projet: $projectTitle

Description:
$description
";

// Headers propres (important pour éviter spam)
$headers = "From: FlyerCraft <noreply@flyercraft.com>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Envoi email
$mailSent = mail($to, $subject, $message, $headers);

// Réponse pour ton JS
if ($mailSent) {
  echo "success";
} else {
  echo "error";
}
?>