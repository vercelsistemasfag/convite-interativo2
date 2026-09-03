export default function ConviteApp() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: '32px',
      textAlign: 'center',
      background: '#f8f4f2',
      color: '#54112f'
    }}>
      <div>
        <h1 style={{ marginBottom: '12px' }}>Celebra Convite</h1>
        <p>Abra seu convite pelo link que você recebeu.</p><a href="celebra://convite/1a35e27998c5" style={{display:"inline-block",marginTop:"24px",padding:"14px 22px",background:"#6a0735",color:"white",borderRadius:"12px",textDecoration:"none"}}>Testar abertura no aplicativo</a>
      </div>
    </main>
  );
}
