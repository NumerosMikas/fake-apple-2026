import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  where,
  Firestore
} from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import type { CatalogoItem, Pedido, Proposta } from './types.ts';

let dbInstance: Firestore | null = null;
let firebaseConfigData: any = null;

export function getFirebaseConfig() {
  if (firebaseConfigData) return firebaseConfigData;
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const raw = fs.readFileSync(configPath, 'utf-8');
    firebaseConfigData = JSON.parse(raw);
    return firebaseConfigData;
  }
  return null;
}

export function getDb(): Firestore {
  if (dbInstance) return dbInstance;
  const config = getFirebaseConfig();
  if (!config) {
    throw new Error('Ficheiro firebase-applet-config.json não encontrado.');
  }

  const app = getApps().length === 0 ? initializeApp(config) : getApp();
  dbInstance = getFirestore(app, config.firestoreDatabaseId);
  return dbInstance;
}

// Initial catalog items grounded in the Apple Portugal 2026 landing page
const INITIAL_CATALOGO: CatalogoItem[] = [
  {
    id: 'iphone-18-pro',
    nome: 'iPhone 18 Pro 256GB',
    descricao: 'Forjado em titânio de grau aeroespacial Titanium Burgundy, processador A19 Pro 2nm e câmara 48MP com ProRes 8K.',
    unidadeVenda: 'unidade',
    precoUnitarioCentimos: 134900, // 1.349,00 €
    moeda: 'EUR',
    ativo: true,
    condicoes: 'Garantia legal de 3 anos em Portugal. Envio prioritário incluído.'
  },
  {
    id: 'iphone-duo',
    nome: 'iPhone Duo Dobrável 256GB',
    descricao: 'Ecrã duplo flexível contínuo sem vinco percetível, multitasking adaptativo para produtividade móvel.',
    unidadeVenda: 'unidade',
    precoUnitarioCentimos: 189900, // 1.899,00 €
    moeda: 'EUR',
    ativo: true,
    condicoes: 'Lote de distribuição regulamentar; garantia de 3 anos.'
  },
  {
    id: 'watch-series-12',
    nome: 'Apple Watch Series 12 GPS + Cellular',
    descricao: 'Monitorização cardíaca validada clinicamente (99,4% correlação médica), sensor de hidratação e ecrã de 3000 nits.',
    unidadeVenda: 'unidade',
    precoUnitarioCentimos: 45900, // 459,00 €
    moeda: 'EUR',
    ativo: true,
    condicoes: 'Garantia legal de 3 anos e assistência autorizada Apple em Portugal.'
  },
  {
    id: 'macbook-pro-m5',
    nome: 'MacBook Pro M5 14" (16GB RAM, 512GB SSD)',
    descricao: 'Processador Apple Silicon M5 com arquitetura neural acelerada, ecrã Liquid Retina XDR e até 22 horas de autonomia.',
    unidadeVenda: 'unidade',
    precoUnitarioCentimos: 204900, // 2.049,00 €
    moeda: 'EUR',
    ativo: true,
    condicoes: 'Elegível para apoio a empresas e campanha de educação; garantia de 3 anos.'
  },
  {
    id: 'airpods-5',
    nome: 'AirPods 5 com Cancelamento Ativo de Ruído',
    descricao: 'Cancelamento Ativo de Ruído adaptativo com arquitetura acústica renovada e Som Espacial personalizado.',
    unidadeVenda: 'unidade',
    precoUnitarioCentimos: 19900, // 199,00 €
    moeda: 'EUR',
    ativo: true,
    condicoes: 'Estojo com carregamento MagSafe e 3 anos de garantia legal.'
  },
  {
    id: 'consultoria-empresarial',
    nome: 'Consultoria e Implantação Empresarial Apple (Por Hora)',
    descricao: 'Sessão técnica especializada com consultor Apple para integração de frotas, políticas de segurança MDM e formação da equipa.',
    unidadeVenda: 'hora',
    precoUnitarioCentimos: 12000, // 120,00 €/hora
    moeda: 'EUR',
    ativo: true,
    condicoes: 'Disponível em regime presencial (Lisboa/Porto) ou remoto via Google Meet.'
  },
  {
    id: 'applecare-plus-frota',
    nome: 'Plano de Proteção AppleCare+ 3 Anos (Pacote)',
    descricao: 'Cobertura ilimitada contra danos acidentais por equipamento, substituição prioritária e apoio técnico telefónico dedicado 24/7.',
    unidadeVenda: 'pacote',
    precoUnitarioCentimos: 24900, // 249,00 €
    moeda: 'EUR',
    ativo: true,
    condicoes: 'Ativação associada ao número de série dos equipamentos adquiridos.'
  }
];

export async function initCatalogoIfNeeded(): Promise<void> {
  try {
    const db = getDb();
    const catalogoRef = collection(db, 'catalogo');
    const snapshot = await getDocs(catalogoRef);
    if (!snapshot.empty) {
      // Catalog already exists, do not duplicate or overwrite modifications made by the student
      return;
    }

    console.log('A inicializar o catálogo comercial de produtos Apple no Firestore...');
    for (const item of INITIAL_CATALOGO) {
      await setDoc(doc(catalogoRef, item.id), item);
    }
    console.log(`Catálogo inicializado com ${INITIAL_CATALOGO.length} itens.`);
  } catch (err) {
    console.error('Erro ao verificar/inicializar catálogo no Firestore:', err);
  }
}

export async function getCatalogo(onlyActive = true): Promise<CatalogoItem[]> {
  const db = getDb();
  const catalogoRef = collection(db, 'catalogo');
  const q = onlyActive ? query(catalogoRef, where('ativo', '==', true)) : catalogoRef;
  const snapshot = await getDocs(q);
  const items: CatalogoItem[] = [];
  snapshot.forEach((d) => {
    items.push(d.data() as CatalogoItem);
  });
  return items;
}

export async function getCatalogoItem(id: string): Promise<CatalogoItem | null> {
  const db = getDb();
  const docRef = doc(db, 'catalogo', id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return snap.data() as CatalogoItem;
}

export async function saveCatalogoItem(item: CatalogoItem): Promise<void> {
  const db = getDb();
  await setDoc(doc(db, 'catalogo', item.id), item);
}

export async function savePedido(pedido: Pedido): Promise<void> {
  const db = getDb();
  await setDoc(doc(db, 'pedidos', pedido.id), pedido);
}

export async function updatePedido(id: string, data: Partial<Pedido>): Promise<void> {
  const db = getDb();
  await updateDoc(doc(db, 'pedidos', id), {
    ...data,
    dataAtualizacao: new Date().toISOString()
  });
}

export async function getPedido(id: string): Promise<Pedido | null> {
  const db = getDb();
  const snap = await getDoc(doc(db, 'pedidos', id));
  if (!snap.exists()) return null;
  return snap.data() as Pedido;
}

export async function listPedidos(filtroEstado?: string): Promise<Pedido[]> {
  const db = getDb();
  const pedidosRef = collection(db, 'pedidos');
  let q = query(pedidosRef, orderBy('dataCriacao', 'desc'));
  if (filtroEstado && filtroEstado !== 'todos') {
    q = query(pedidosRef, where('estadoProcessamento', '==', filtroEstado), orderBy('dataCriacao', 'desc'));
  }
  const snap = await getDocs(q);
  const list: Pedido[] = [];
  snap.forEach((d) => {
    list.push(d.data() as Pedido);
  });
  return list;
}

export async function saveProposta(proposta: Proposta): Promise<void> {
  const db = getDb();
  await setDoc(doc(db, 'propostas', proposta.id), proposta);
}

export async function getProposta(id: string): Promise<Proposta | null> {
  const db = getDb();
  const snap = await getDoc(doc(db, 'propostas', id));
  if (!snap.exists()) return null;
  return snap.data() as Proposta;
}

export async function getPropostaByToken(token: string): Promise<Proposta | null> {
  if (!token || typeof token !== 'string') return null;
  const db = getDb();
  const propostasRef = collection(db, 'propostas');
  const q = query(propostasRef, where('token', '==', token));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as Proposta;
}

export async function updateProposta(id: string, data: Partial<Proposta>): Promise<void> {
  const db = getDb();
  await updateDoc(doc(db, 'propostas', id), data);
}
