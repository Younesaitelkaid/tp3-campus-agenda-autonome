import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, View } from 'react-native';

/* ========== 1. Types et données ========== */

type Evenement = {
  id: string;
  titre: string;
  categorie: 'Atelier' | 'Conference' | 'Rencontre';
  capacite: number;
  inscrits: number;
};

const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conference IA', categorie: 'Conference', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Securite mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Decouverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];

/* ========== 2. Fonctions de calcul ========== */

// Jamais de valeur négative
function placesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}

function statutEvenement(e: Evenement): string {
  const r = placesRestantes(e);
  if (r === 0) return 'Complet';
  if (r <= 3) return 'Presque complet';
  return 'Ouvert';
}

/* ========== 3. Indicateurs globaux ========== */

const total = evenements.length;
const nbComplets = evenements.filter((e) => placesRestantes(e) === 0).length;
const nbAvecPlaces = evenements.filter((e) => placesRestantes(e) > 0).length;
const totalPlaces = evenements.reduce((somme, e) => somme + placesRestantes(e), 0);

const ateliersDisponibles = evenements.filter(
  (e) => e.categorie === 'Atelier' && placesRestantes(e) >= 1
);

/* ========== 4. Mode d'affichage ========== */

type Mode = 'tous' | 'ateliers';
const mode = 'tous' as Mode; // changer ici : 'tous' ou 'ateliers'

const donneesAffichees = mode === 'tous' ? evenements : ateliersDisponibles;
const titreMode = mode === 'tous' ? 'Tous les événements' : 'Ateliers disponibles';

/* ========== 5. Composants réutilisables ========== */

type BadgeEtatProps = { statut: string };

function BadgeEtat({ statut }: BadgeEtatProps) {
  let fond = '#DCFCE7';
  let texte = '#166534';

  if (statut === 'Complet') {
    fond = '#FEE2E2';
    texte = '#991B1B';
  } else if (statut === 'Presque complet') {
    fond = '#FFEDD5';
    texte = '#9A3412';
  }

  return (
    <View style={[styles.badge, { backgroundColor: fond }]}>
      <Text style={[styles.badgeTexte, { color: texte }]}>{statut}</Text>
    </View>
  );
}

type CarteEvenementProps = { evenement: Evenement };

function CarteEvenement({ evenement }: CarteEvenementProps) {
  const r = placesRestantes(evenement);
  return (
    <View style={styles.carte}>
      <View style={styles.carteInfos}>
        <Text style={styles.carteTitre} numberOfLines={2}>
          {evenement.titre}
        </Text>
        <Text style={styles.carteCategorie}>{evenement.categorie}</Text>
        <Text style={styles.cartePlaces}>
          {r} {r > 1 ? 'places restantes' : 'place restante'}
        </Text>
      </View>
      <BadgeEtat statut={statutEvenement(evenement)} />
    </View>
  );
}

type BlocStatistiqueProps = { libelle: string; valeur: number };

function BlocStatistique({ libelle, valeur }: BlocStatistiqueProps) {
  return (
    <View style={styles.bloc}>
      <Text style={styles.blocValeur}>{valeur}</Text>
      <Text style={styles.blocLibelle}>{libelle}</Text>
    </View>
  );
}

/* ========== 6. Écran principal ========== */

export default function App() {
  return (
    <View style={styles.container}>
      <FlatList
        data={donneesAffichees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CarteEvenement evenement={item} />}
        ListHeaderComponent={
          <View>
            <View style={styles.entete}>
              <Text style={styles.enteteTitre}>CampusAgenda</Text>
              <Text style={styles.enteteSousTitre}>Événements du campus</Text>
            </View>

            <View style={styles.statsLigne}>
              <BlocStatistique libelle="Événements" valeur={total} />
              <BlocStatistique libelle="Complets" valeur={nbComplets} />
              <BlocStatistique libelle="Avec places" valeur={nbAvecPlaces} />
              <BlocStatistique libelle="Places restantes" valeur={totalPlaces} />
            </View>

            <Text style={styles.titreMode}>{titreMode}</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.vide}>
            <Text style={styles.videTexte}>
              Aucun événement à afficher pour le moment.
            </Text>
          </View>
        }
      />
      <StatusBar style="auto" />
    </View>
  );
}

/* ========== 7. Styles ========== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    padding: 16,
    paddingTop: 60,
  },
  entete: {
    backgroundColor: '#1E3A8A',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  enteteTitre: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  enteteSousTitre: { color: '#BFDBFE', fontSize: 14, marginTop: 4 },
  statsLigne: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bloc: {
    width: '48%',
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  blocValeur: { fontSize: 26, fontWeight: 'bold', color: '#1E3A8A' },
  blocLibelle: { fontSize: 13, color: '#1D4ED8', marginTop: 2 },
  titreMode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 8,
    marginBottom: 12,
  },
  carte: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  carteInfos: { flex: 1, flexShrink: 1, marginRight: 10 },
  carteTitre: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
  carteCategorie: { fontSize: 13, color: '#64748B', marginTop: 2 },
  cartePlaces: { fontSize: 14, color: '#1D4ED8', marginTop: 6 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  badgeTexte: { fontSize: 12, fontWeight: 'bold' },
  vide: { alignItems: 'center', padding: 24 },
  videTexte: { fontSize: 15, color: '#64748B', textAlign: 'center' },
});
